import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Tracker from "@/components/Tracker";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SBA Conseil | Courtier en Assurances Premium",
  description: "SBA Conseil, cabinet de courtage en assurances de prestige en France. Obtenez votre devis personnalisé en ligne pour automobile, moto et trottinette électrique.",
  keywords: ["assurance", "courtier assurance", "assurance premium", "assurance auto", "assurance moto", "assurance trottinette", "SBA Conseil"],
  authors: [{ name: "SBA Conseil" }],
  openGraph: {
    title: "SBA Conseil | Courtier en Assurances Premium",
    description: "SBA Conseil, cabinet de courtage en assurances de prestige en France. Solutions de couverture sur-mesure.",
    type: "website",
    siteName: "SBA Conseil",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBA Conseil | Courtier en Assurances Premium",
    description: "Solutions d'assurance sur-mesure et prestige avec SBA Conseil.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <Tracker />
        {children}
      </body>
    </html>
  );
}
