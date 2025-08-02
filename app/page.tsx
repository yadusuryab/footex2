"use client";
import { Connect } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { FeaturesSection } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { ProductCardWithSale } from "@/components/sections/sale-is-live";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {  Settings, Search, Instagram } from "lucide-react";
import { Social } from "@/components/sections/social";

export default function Home() {
  return (
    <div className="flex  py-0  flex-col ">
    
    <div className="bg-black overflow-hidden whitespace-nowrap transform -rotate-3 origin-left">
  <div className="inline-block min-w-full animate-marquee text-white text-2xl px-4">
  BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 •
  BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 • BUY ONE GET ONE AT ₹999 •
  </div>
</div>

<div className="px-4">
<Hero filter="999"/>
</div>
<div>
       
<div className="bg-black overflow-hidden whitespace-nowrap transform rotate-3 origin-left">
  <div className="inline-block min-w-full animate-marquee text-white text-2xl px-4">
  BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 •
  BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 • BUY ONE GET ONE AT ₹499 •
  </div>
</div>
<div className="px-4">
<Hero filter="499"/>
</div>
     </div>
      <div className="container  mx-auto px-4 pt-2">
    

       
        <ProductCardWithSale />
      <div className="fixed z-10 right-4 mx-auto max-w-[500px] bottom-4">
      <Social/>
      </div>
      </div>
    </div>
  );
}
