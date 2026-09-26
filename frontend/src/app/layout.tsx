import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "ManakSetu | AI-Powered Indian Standards Recommendation Engine",
  description:
    "Ministry of Consumer Affairs, Food & Public Distribution (DoCA) & Bureau of Indian Standards (BIS) AI recommendation engine for identifying applicable Indian Standards (IS), mandatory QCOs, and normative references in procurement specifications.",
  keywords: [
    "Bureau of Indian Standards",
    "Indian Standards",
    "BIS",
    "DoCA",
    "Quality Control Orders",
    "QCO",
    "GeM Portal",
    "Public Procurement",
    "IS Codes",
    "Tender Compliance"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-maroon-700 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
