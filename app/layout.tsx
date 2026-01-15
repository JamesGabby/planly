import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { UserModeProvider } from "@/components/UserModeContext";
import { CustomToastContainer } from "@/components/ui/CustomToastContainer";
import CookieConsent from "@/components/CookieConsent";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lessonly",
  description: "Lessonly helps teachers, student teachers and tutors easily plan, organise, and deliver effective lessons.",
};

const inter = Inter({
  variable: "--font-quick-sand",
  display: "swap",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserModeProvider>
            {children}
          </UserModeProvider>
        </ThemeProvider>
        <CustomToastContainer />
        <CookieConsent />
      </body>
    </html>
  );
}
