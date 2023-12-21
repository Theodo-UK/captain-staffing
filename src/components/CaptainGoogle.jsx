import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { load } from "../helpers/spreadsheet";

export const CaptainGoogle = ({ onSuccess, onFailure, onLoad }) => {
  const login = useGoogleLogin({
    onSuccess: (authResult) => {
      handleAuth(authResult);
    },
    scope: import.meta.env.VITE_GOOGLE_SCOPE,
  });

  const handleAuth = (authResult) => {
    if (authResult && !authResult.error) {
      onSuccess();
      load(onLoad, authResult);
    } else {
      onFailure();
    }
  };

  return (
    <button onClick={() => login()} className="btn">
      Connect with Google
    </button>
  );
};

export default CaptainGoogle;
