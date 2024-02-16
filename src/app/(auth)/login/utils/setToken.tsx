import Cookies from "js-cookie";
export const setToken = (token: string) => {
  const currentTime = Date.now() / 1000;
  Cookies.set("token", token, { expires: 30 });
  Cookies.set("tokenExpiration", (currentTime + 30 * 24 * 60 * 60).toString(), {
    expires: 30,
  });
};
