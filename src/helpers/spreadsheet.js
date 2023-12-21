import { orderBy } from "lodash";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { buildProjects, buildStaffing, removePastWeeks } from "./formatter";

const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

export function getSyncStatus(callback) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: spreadsheetId,
        range: "Metadata!A:AV",
      })
      .then(
        (response) => {
          console.log("[Sync Response]", response);
          const statusValue = response.result.values[1][0]
            ? response.result.values[1][0]
            : "";
          const isSyncing = statusValue === "running";
          callback(isSyncing);
        },
        (response) => {
          callback(null, response.result.error);
        }
      );
  });
}

export function scheduleUpdate() {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: spreadsheetId,
        range: "Metadata!A3",
        resource: {
          values: [["UPDATE_SCHEDULED"]],
        },
        valueInputOption: "RAW",
      })
      .then(
        (response) => {
          console.log(response);
        },
        (response) => {
          window.alert("error: " + response.result.error.message);
        }
      );
  });
}

/**
 * Load the content from the spreadsheet
 */
// export function load(callback) {
//   window.gapi.client.load("sheets", "v4", () => {
//     window.gapi.client.sheets.spreadsheets.values
//       .batchGet({
//         spreadsheetId: spreadsheetId,
//         ranges: ["StaffingView!A:AV", "ProjectView!A:AV", "Metadata!A:AV"],
//       })
//       .then(
//         (response) => {
//           console.log("[Response]", response);

//           const staffingRows = response.result.valueRanges[0].values || [];
//           const projectRows = response.result.valueRanges[1].values || [];

//           const lastUpdated = response.result.valueRanges[2].values
//             ? response.result.valueRanges[2].values[0][0]
//             : "";

//           let weeks = staffingRows[1].slice(4);

//           let globalStaffing = buildStaffing(staffingRows);
//           let globalProjects = buildProjects(projectRows);

//           globalStaffing = orderBy(
//             globalStaffing,
//             ["company", "_name"],
//             ["asc", "asc"]
//           );
//           console.log("[Staffing]", globalStaffing);

//           globalProjects = orderBy(globalProjects, ["_name"], ["asc"]);
//           console.log("[Projects]", globalProjects);

//           const companies = Array.from(
//             new Set(
//               globalStaffing
//                 .map((staffing) => {
//                   return staffing.company;
//                 })
//                 .filter((company) => {
//                   return company !== undefined && company !== "BU";
//                 })
//             )
//           );
//           console.log("[Companies]", companies);

//           const positions = Array.from(
//             new Set(
//               globalStaffing
//                 .map((staffing) => {
//                   return staffing.position;
//                 })
//                 .filter((position) => {
//                   return position !== undefined && position !== "Position";
//                 })
//             )
//           );
//           console.log("[Positions]", positions);

//           weeks = removePastWeeks(weeks);
//           console.log("[Weeks]", weeks);

//           callback(
//             weeks,
//             globalStaffing,
//             companies,
//             positions,
//             globalProjects,
//             lastUpdated
//           );
//         },
//         (response) => {
//           callback(null, null, response.result.error);
//         }
//       );
//   });
// }

export const load = async (callback, authResult) => {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
  // const token = loginState$.token.get();

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

  let weeks = staffingData.headerValues.slice(5);

  let globalStaffing = buildStaffing(staffingRows);
  let globalProjects = buildProjects(projectRows);

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
          return company !== undefined && company !== "BU";
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
