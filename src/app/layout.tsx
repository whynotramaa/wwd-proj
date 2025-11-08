import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "OpenResume - Free Resume Builder for Indian Job Market",
  description:
    "OpenResume is a free, open-source, and powerful resume builder designed for the Indian job market. Create ATS-friendly professional resumes in minutes. Test your resume's ATS readability with our built-in parser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased")}>
        <TopNavBar />
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
