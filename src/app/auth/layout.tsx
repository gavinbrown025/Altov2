import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={appearance}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}