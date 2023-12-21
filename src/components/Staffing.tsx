import { FC, useEffect } from "react";
import { observer } from "@legendapp/state/react";
import { loginState$ } from "../state/auth";
import { GoogleSpreadsheet } from "google-spreadsheet";

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
    console.log(doc.title);
    const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
    console.log(sheet);
  };

  return <div>hi</div>;
});

export default Staffing;
