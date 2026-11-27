import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARMILAR — 3D Fashion Store",
  description: "Explore the PARMILAR collection in an interactive 3D clothing store."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
