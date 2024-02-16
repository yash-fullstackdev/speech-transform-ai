"use client";
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import Navbar from "./components/navbar";
import SideDrawer from "./components/side-drawer";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "./Hoc/withAuth";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const pathCheck = pathname.includes("login") || pathname.includes("sign-up");
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <Box sx={{ display: "flex" }}>
            {!pathCheck && <SideDrawer />}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                p: !pathCheck ? 3 : 0,
              }}
            >
              <ToastContainer autoClose={3000} />
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </>
  );
}

export default withAuth(RootLayout);
