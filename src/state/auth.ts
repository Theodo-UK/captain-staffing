import { observable } from "@legendapp/state";

export const loginState$ = observable({
  isGoogleAuthenticated: false,
  token: ""
});
