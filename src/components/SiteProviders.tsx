"use client";
import React, { createContext, useContext, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";

const MappedSite = createContext("");
export function useSitePath() {
  const mapped = useContext(MappedSite);
  return useCallback((site: string, ...parts: string[]) => "/" +
    (mapped === site ? parts : [site, ...parts]).map(encodeURIComponent).join("/"), [mapped]);
}
export default function SiteProviders({ site, children }: { site: string; children: React.ReactNode }) {
  return <MappedSite.Provider value={site}><ThemeProvider theme={theme}>
    <CssBaseline />{children}
  </ThemeProvider></MappedSite.Provider>;
}

export function useContentHref() {
  const mapped = useContext(MappedSite);
  return (href: string | undefined) => {
    if (!mapped || !href) return href;
    const prefix = "/" + encodeURIComponent(mapped);
    if (href === prefix) return "/";
    return href.startsWith(prefix + "/") ? href.slice(prefix.length) : href;
  };
}
