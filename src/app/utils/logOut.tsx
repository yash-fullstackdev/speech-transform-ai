import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const logOut = () => {
  Cookies.remove("token");
  localStorage.removeItem("userData");
  toast.success("logout Successfull!");
};
