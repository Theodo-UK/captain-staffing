import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { load } from "../helpers/spreadsheet";

export const CaptainGoogle = ({ onSuccess, onFailure, onLoad }) => {
  const storedAuthResult = Cookies.get("authResult");

  const login = useGoogleLogin({
    onSuccess: (authResult) => {
      handleAuth(authResult);
    },
    auto_select: true,
    scope: import.meta.env.VITE_GOOGLE_SCOPE,
  });

  const handleAuth = (authResult) => {
    if (authResult && !authResult.error) {
      // Calculate expiration time based on expires_in (convert seconds to milliseconds)
      const expirationTime = Date.now() + authResult.expires_in * 1000;

      Cookies.set(
        "authResult",
        JSON.stringify({ ...authResult, expires_at: expirationTime }),
        { expires: 7 }
      );

      onSuccess();
      load(onLoad);
    } else {
      onFailure();
    }
  };

  useEffect(() => {
    if (storedAuthResult) {
      onSuccess();
      load(onLoad);
    }
  }, [onSuccess, onLoad, storedAuthResult]);

  return (
    <>
      <button onClick={() => login()} className="btn">
        Connect with Google
      </button>
    </>
  );
};

export default CaptainGoogle;
