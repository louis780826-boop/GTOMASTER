
import "./globals.css";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "GTO+ MASTER",
  description: "Poker GTO Training & Range System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
