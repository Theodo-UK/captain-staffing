import { useGoogleLogin } from "@react-oauth/google";
import { FC } from "react";
import { observer } from "@legendapp/state/react";
import { loginState$ } from "../state/auth";

interface Props {}

const GoogleSignIn: FC<Props> = observer(() => {
  const isGoogleAuthenticated = loginState$.isGoogleAuthenticated.get();
  const login = useGoogleLogin({
    onSuccess: (token) => {
      loginState$.isGoogleAuthenticated.set(true);
      loginState$.token.set(token.access_token);
    },
    scope: import.meta.env.VITE_GOOGLE_SCOPE,
  });

  if (!isGoogleAuthenticated) {
    return (
      <div>
        <button onClick={() => login()}>Sign in with Google 🚀</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      Logged in!
      {/* <LastUpdatedText lastUpdatedString={this.state.lastUpdatedTime} />
      <ReloadButton
        reloadFunction={this.state.isRefreshRequired ? reload : scheduleUpdate}
        syncStatus={this.state.isSyncing}
        isRefreshRequired={this.state.isRefreshRequired}
      /> */}
    </div>
  );
});

export default GoogleSignIn;
