import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { MuiProvider } from "@/components/providers/MuiProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virva Svala — Software Developer",
  description:
    "Portfolio of Virva Svala — Software Developer, MSc Computer Science, 6+ years of full stack experience with React, Next.js, TypeScript, and Node.js.",
  openGraph: {
    title: "Virva Svala — Software Developer",
    description:
      "Portfolio: React, Next.js, TypeScript, Node.js, geospatial apps, weather services.",
    type: "website",
    url: "https://virvasvala.vercel.app",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as "fi" | "en";

  return (
    <html lang={lang} className={geist.variable} style={{ scrollBehavior: "smooth" }}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
