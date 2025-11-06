import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-config";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import GoogleTagManager from "@/components/analyatics/GoogleTagManager";


const inter = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: site.name,
  description: "Buy quality products at affordable price.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    
      <body className={`${inter.className} antialiased`}>
        <Header />
        <div className="py-5 min-h-screen">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
