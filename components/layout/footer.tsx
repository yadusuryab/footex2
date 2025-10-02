"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { site } from "@/lib/site-config";
import Link from "next/link";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";

function Footer() {
  const [isChatOpen, setIsChatOpen] = React.useState<string>();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors  duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {site.name}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your destination for footwear. Step into style with our curated collection of trendy and comfortable shoes.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Link href={site.social.instagram} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                    
                        <IconBrandInstagram  className="h-8 w-8" />
                      
                    </Button>
                    </Link>
                     
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Link href={`https://wa.me/${site.social.whatsapp}`} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      
                        <IconBrandWhatsapp className="h-8 w-8" />
                     
                    </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat with us on WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                All Products
              </Link>
              <Link 
                href="/about" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <nav className="space-y-2">
              <Link 
                href="/shipping" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                Shipping Info
              </Link>
              <Link 
                href="/returns" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                Returns & Exchanges
              </Link>
              <Link 
                href="/size-guide" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                Size Guide
              </Link>
              <Link 
                href="/faq" 
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 duration-200"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{site.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>{site.email}</span>
              </div>
              {site.address && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span className="flex-1">{site.address}</span>
                </div>
              )}
            </div>
            
            {/* Business Hours */}
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by <Link href={'https://instagram.com/getshopigo'}>Shopigo</Link></span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {currentYear} {site.name}. All rights reserved.
            </p>
            
            <nav className="flex gap-4 text-sm">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                Privacy
              </Link>
              <Link 
                href="/T&C" 
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                Terms
              </Link>
              <Link 
                href="/cookies" 
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };