import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/AppProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PingMe",
  description:
    "A social media platform for sharing your thoughts and connecting with others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} font-sans antialiased bg-gray-950 text-white h-screen w-screen overflow-hidden ">
`}
        suppressHydrationWarning
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
