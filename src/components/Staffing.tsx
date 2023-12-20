import { FC, useEffect } from "react";
import { observer } from "@legendapp/state/react";
import { loginState$ } from "../state/auth";

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

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginState$.token.get()}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Spreadsheet Details:", data);
      } else {
        console.error("Error accessing spreadsheet:", response.statusText);
      }
    } catch (error) {
      console.error("Error accessing spreadsheet:", error);
    }
  };

  return <div>hi</div>;
});

export default Staffing;
