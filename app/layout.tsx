import type { Metadata } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Scholarflow - AI Study Organizer",
  description: "AI-powered study organization for university students."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${instrumentSerif.variable} theme-gradient min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
