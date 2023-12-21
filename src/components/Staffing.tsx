import { FC, useEffect } from "react";
import { observer } from "@legendapp/state/react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { orderBy } from "lodash";
import { loginState$ } from "../state/auth";
import {
  buildProjects,
  buildStaffing,
  removePastWeeks,
  //@ts-ignore
} from "../helpers/formatter";

interface Props {}

const Staffing: FC<Props> = observer(() => {
  const isGoogleAuthenticated = loginState$.isGoogleAuthenticated.get();
  console.log("google auth: " + isGoogleAuthenticated);

  useEffect(() => {
    if (isGoogleAuthenticated) {
      accessSpreadsheet();
    }
  }, [isGoogleAuthenticated]);

  const accessSpreadsheet = async () => {
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
    const token = loginState$.token.get();

    const doc = new GoogleSpreadsheet(spreadsheetId, { token });
    await doc.loadInfo(); // loads document properties and worksheets

    type rangeKey = "StaffingView" | "ProjectView" | "Metadata";
    const ranges: rangeKey[] = ["StaffingView", "ProjectView", "Metadata"];

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
          .map((staffing: { company?: string }) => {
            return staffing.company;
          })
          .filter((company?: string) => {
            return company !== undefined && company !== "BU";
          })
      )
    );
    console.log("[Companies]", companies);

    const positions = Array.from(
      new Set(
        globalStaffing
          .map((staffing: { position?: string }) => {
            return staffing.position;
          })
          .filter((position?: string) => {
            return position !== undefined && position !== "Position";
          })
      )
    );
    console.log("[Positions]", positions);

    weeks = removePastWeeks(weeks);
    console.log("[Weeks]", weeks);

    // callback(
    //   weeks,
    //   globalStaffing,
    //   companies,
    //   positions,
    //   globalProjects,
    //   lastUpdated
    // );
  };

  return <div>hi</div>;
});

export default Staffing;
