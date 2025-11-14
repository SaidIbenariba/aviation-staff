import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "Aviation Staff - Dashboard",
  description:
    "Aviation Staff - Plateforme de gestion pour l'emploi dans l'aviation",
  icons: {
    icon: "/aviationstaff.png",
    apple: "/aviationstaff.png",
  },
  openGraph: {
    title: "Aviation Staff",
    description:
      "Aviation Staff - Plateforme de gestion pour l'emploi dans l'aviation",
    url: "nextstarter.xyz",
    siteName: "Aviation Staff",
    images: [
      {
        url: "/aviationstaff.png",
        width: 400,
        height: 400,
        alt: "Aviation Staff Logo",
      },
    ],
    locale: "fr-FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-[-apple-system,BlinkMacSystemFont]antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
