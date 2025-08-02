import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/site-config"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Script from "next/script" 

const inter = Poppins({
  subsets: ["latin"],
  weight:['400']
})

export const metadata: Metadata = {
  title: site.name,
  description: "Buy quality products at affordable price.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Add Meta Pixel script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1386100692693528'); 
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* ✅ Optional fallback for users with no JS */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1386100692693528&ev=PageView&noscript=1"
          />
        </noscript>
      </head>

      <body className={`${inter.className} antialiased`}>
        {/* <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange> */}
          <Header />
          <div className="py-20 min-h-screen">{children}</div>
          <Footer />
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
