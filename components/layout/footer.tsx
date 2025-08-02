"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";
import { site } from "@/lib/site-config";
import Link from "next/link";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";

function Footer() {
  const [isChatOpen, setIsChatOpen] = React.useState<string>();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors z-50 duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
         
       
          {/* <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>{site.address}</p>
              <p>Phone: {site.phone}</p>
              <p>Email: {site.email}</p>
            </address>
          </div> */}
       
        </div>
        <div className=" flex flex-col items-center justify-between gap-4   text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {site.name}. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-main"
            >
              Privacy
            </Link>
            <Link href="/T&C" className="transition-colors hover:text-main">
              Terms
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-main">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
