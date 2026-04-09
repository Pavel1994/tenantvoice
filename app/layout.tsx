import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "TenantVoice",
  description: "Find the truth before you rent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-800 bg-slate-950 px-4 py-6 text-sm text-slate-400">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{siteConfig.name} helps renters share factual housing reviews.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="hover:text-white">
                Terms of Use
              </Link>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="hover:text-white"
              >
                Report content
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
