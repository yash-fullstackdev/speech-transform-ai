"use client";
import { usePathname, useRouter } from "next/navigation";
import cookies from "js-cookie";
import { verifyUser } from "../utils/verifyUser";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    if (typeof window !== "undefined") {
      const token = cookies.get("token");
      const pathName = usePathname();
      if (pathName === "/login" || pathName === "/sign-up") return <WrappedComponent {...props} />
      const data = JSON.parse(localStorage.getItem("userData") || "{}");
      const router = useRouter();
      const id = data.id;
      if (id) {
        const isAuthenticated = async () => {
          const data = await verifyUser(id);
          console.log(data);
          return !data && router.push("/login");
        };
        isAuthenticated();
      }

      if (!token || !data.id) {
        return router.push("/login");
      }

    }
      return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
