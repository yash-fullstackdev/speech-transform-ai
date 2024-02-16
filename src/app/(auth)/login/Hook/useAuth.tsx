"use client";
import { useState, useEffect } from "react";
import cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return isAuthenticated;
};

export default useAuth;
