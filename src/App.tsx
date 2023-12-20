import "./App.css";
import GoogleSignIn from "./components/GoogleSignIn";
import Staffing from "./components/Staffing";

function App() {
  return (
    <>
      <div className="app">
        <div className="app__bar">
          <h1 className="brand">Captain Staffing</h1>
          <div className="loader__container">
            <GoogleSignIn />
          </div>
        </div>
        <Staffing />
        {/* <div className="content">{this.renderStaffing()}</div> */}
      </div>
    </>
  );
}

export default App;
