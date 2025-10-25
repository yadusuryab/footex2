"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site-config";

function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/checkout") return null;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-primary">{site.name}</h3>
            <p className="text-sm text-muted-foreground">
              From <Link href={'https://instagram.com/getshopigo'} className="text-bold text-black italic">Shopigo</Link>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <div className="space-y-1 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-foreground">Home</Link>
              <Link href="/products" className="block text-muted-foreground hover:text-foreground">Products</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <div className="space-y-1 text-sm">
              <Link href="/T&C" className="block text-muted-foreground hover:text-foreground">Shipping</Link>
              <Link href="/T&C" className="block text-muted-foreground hover:text-foreground">Returns</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>{site.phone}</div>
              {site.address && <div>{site.address}</div>}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>© {currentYear} {site.name}. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-foreground">Privacy</Link>
              <Link href="/T&C" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };