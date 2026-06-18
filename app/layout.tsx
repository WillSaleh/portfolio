import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const hankenGrotesk = Hanken_Grotesk({ variable: "--font-hanken-grotesk", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "William Saleh - Software & Cloud Engineer",
  description: "William Saleh - software and cloud engineer specializing in AWS, distributed systems, and full-stack web. Los Angeles, CA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${plexMono.variable} antialiased`}
      >
        <body>{children}</body>
      </html>
  );
}