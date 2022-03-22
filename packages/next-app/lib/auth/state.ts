import jwt_decode from "jwt-decode";
import { refreshAuth } from "@/queries/auth/refresh";

interface authToken {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
export const setAuthenticationToken = ({ token }: authToken) => {
  // console.log(token);
  sessionStorage.setItem("access_token", token.accessToken);
  sessionStorage.setItem("refresh_token", token.refreshToken);
};

export const getAuthenticationToken = () => {
  console.log("getAuthenticationToken");
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("access_token");
    return token;
  }
};

export const checkAuthenticationToken = async () => {
  console.log("checkAuthenticationToken");
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("access_token");
    var decoded = jwt_decode(token as string);
    // console.log(decoded);
    console.log(Date.now() / 1000);
    // console.log(token);
    if (token && decoded.exp > Date.now() / 1000) {
      console.log("token is valid");
    } else {
      console.log("token is invalid");
      const refreshToken = sessionStorage.getItem("refresh_token");
      if (refreshToken) {
        console.log("refresh token is present");
        const response = await refreshAuth(refreshToken);
        // console.log(response.data.refresh);
        // setAuthenticationToken(response.data.refresh);
      } else {
        console.log("no refresh token");
      }
    }
    return true;
  }
};
