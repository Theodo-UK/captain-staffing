import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { load } from "../helpers/spreadsheet";

export const CaptainGoogle = ({ onSuccess, onFailure, onLoad }) => {
  const storedAuthResult = JSON.parse(localStorage.getItem("authResult"));

  const login = useGoogleLogin({
    onSuccess: (authResult) => {
      handleAuth(authResult);
    },
    auto_select: true,
    scope: import.meta.env.VITE_GOOGLE_SCOPE,
  });

  const handleAuth = (authResult) => {
    if (authResult && !authResult.error) {
      localStorage.setItem("authResult", JSON.stringify(authResult));

      onSuccess();
      load(onLoad, authResult);
    } else {
      onFailure();
    }
  };

  useEffect(() => {
    if (storedAuthResult) {
      onSuccess();
      load(onLoad, storedAuthResult);
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
