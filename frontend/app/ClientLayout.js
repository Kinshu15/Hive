"use client";

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <ThemeProvider theme={theme}>
      {!isAuthPage && <Header />}
      {children}
    </ThemeProvider>
  );
}
