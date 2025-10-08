import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DashboardProvider } from "@/contexts/DashboardContext";

import "./globals.css";

import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import { SearchProvider } from "@/contexts/SearchContext";
import { QueueProvider } from "@/contexts/QueueContext";

export const metadata: Metadata = {
  title: "Alto on Spotify",
  description:
    "A minimal music player for Spotify with extra sorting, filtering, and analysis.",
};

const appearance = {
  cssLayerName: "clerk",
  variables: {
    colorBackground: "var(--color-neutral)",
    colorPrimary: "var(--color-primary)",
    colorForeground: "var(--color-neutral-content)",
    colorPrimaryForeground: "var(--color-primary-content)",
    colorText: "var(--color-neutral-content)",
    colorTextSecondary: "var(--color-neutral-content)",
    colorBorder: "var(--color-neutral-content)",
    colorInput: "var(--color-neutral)",
    colorInputBackground: "var(--color-neutral)",
    colorInputText: "var(--color-neutral-content)",
    colorInputForeground: "var(--color-neutral-content)",
    colorNeutral: "var(--color-base-content)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={appearance}>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen antialiased">
          <DashboardProvider>
            <SearchProvider>
              <QueueProvider>
                <div className="grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr] h-screen">
                  <Nav className="col-span-full" />
                  <Sidebar />
                  <main className=" overflow-y-auto p-6">{children}</main>
                  <Player className="col-span-full" />
                </div>
              </QueueProvider>
            </SearchProvider>
          </DashboardProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
