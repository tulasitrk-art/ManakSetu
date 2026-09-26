import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Hidden Google Translate Mount Container */}
        <div id="google_translate_element" style={{ display: "none" }} />
        
        {/* Google Website Translate Init Script */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,te,hi,mr,ta,gu,bn,kn,ml',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              };
            `,
          }}
        />
        <Script
          id="google-translate-script"
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
