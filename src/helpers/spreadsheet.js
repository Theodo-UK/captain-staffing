import { orderBy } from "lodash";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Cookies from "js-cookie";

import { buildProjects, buildStaffing, removePastWeeks } from "./formatter";

const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

export async function getSyncStatus(callback) {
  const storedAuthResult = Cookies.get("authResult");
  const authResult = JSON.parse(storedAuthResult);

  const doc = new GoogleSpreadsheet(spreadsheetId, {
    token: authResult.access_token,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle["Metadata"];

  const range = "A:AV";

  const cells = await sheet.getCellsInRange(range);

  // Assuming the status value is in the second row (1-based index) of the first column (0-based index)
  const statusValue = cells[1][0] || "";
  const isSyncing = statusValue.toLowerCase() === "running";

  callback(isSyncing);
}

export async function scheduleUpdate() {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
  const storedAuthResult = Cookies.get("authResult");
  const authResult = JSON.parse(storedAuthResult);

  const doc = new GoogleSpreadsheet(spreadsheetId, {
    token: authResult.access_token,
  });
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByTitle["Metadata"];
  await sheet.loadCells("A1:A3");
  const a1 = sheet.getCell(2, 0);
  a1.value = "UPDATE_SCHEDULED";

  try {
    // Save the changes
    await sheet.saveUpdatedCells();
  } catch (e) {
    window.alert("error: " + e.response.data.error.message);
  }
}

export const load = async (callback, authResult) => {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

  console.log("loading spreadsheets..");

  const doc = new GoogleSpreadsheet(spreadsheetId, {
    token: authResult.access_token,
  });
  await doc.loadInfo(); // loads document properties and worksheets

  const ranges = ["StaffingView", "ProjectView", "Metadata"];

  const response = await Promise.all(
    ranges.map(async (range) => {
      const sheet = doc.sheetsByTitle[range];

      //For staffing and project view, we want to skip first two rows to ensure we get the full table.
      if (range !== "Metadata") sheet.loadHeaderRow(2);

      const rows = await sheet.getRows();
      return {
        range,
        headerValues: sheet.headerValues,
        //@ts-expect-error rawData is required to not change structure.
        rows: rows.map((row) => row._rawData),
      };
    })
  );

  const staffingData = response[0];
  const staffingRows = staffingData.rows || [];
  const projectRows = response[1].rows || [];

  const lastUpdated = response[2]?.headerValues[0];

  let weeks = staffingData.headerValues.slice(4);

  let globalStaffing = buildStaffing(staffingRows, weeks);
  let globalProjects = buildProjects(projectRows, weeks);

  globalStaffing = orderBy(
    globalStaffing,
    ["company", "_name"],
    ["asc", "asc"]
  );
  console.log("[Staffing]", globalStaffing);

  globalProjects = orderBy(globalProjects, ["_name"], ["asc"]);
  console.log("[Projects]", globalProjects);

  const companies = Array.from(
    new Set(
      globalStaffing
        .map((staffing) => {
          return staffing.company;
        })
        .filter((company) => {
          return company !== undefined && company !== "BU" && company !== "";
        })
    )
  );
  console.log("[Companies]", companies);

  const positions = Array.from(
    new Set(
      globalStaffing
        .map((staffing) => {
          return staffing.position;
        })
        .filter((position) => {
          return position !== undefined && position !== "Position";
        })
    )
  );
  console.log("[Positions]", positions);

  weeks = removePastWeeks(weeks);
  console.log("[Weeks]", weeks);

  callback(
    weeks,
    globalStaffing,
    companies,
    positions,
    globalProjects,
    lastUpdated
  );
};
