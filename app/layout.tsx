import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ensureAdminUser } from "@/lib/initAdmin";
import { UserInfoProvider } from "../provider/userInfoProvider";
import { Providers } from "@/provider/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code crafted",
  description: "Crafting solution one time at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ensureAdminUser().catch(console.error);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f1f6f9]`}
      >
        <Providers>
          <UserInfoProvider>
            <ToastContainer />
            {children}
          </UserInfoProvider>
        </Providers>
      </body>
    </html>
  );
}
