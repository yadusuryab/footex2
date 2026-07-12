"use client";

import BrandStory from "@/components/sections/brand-story-about";
import { Hero } from "@/components/sections/hero";
import { ReviewsBento } from "@/components/sections/review-bento";
import { ProductCardWithSale } from "@/components/sections/sale-is-live";

export default function Home() {
  return (
    <div className="flex py-0 flex-col min-h-screen">
      <div className="relative overflow-hidden">
        <div className="px-4">
          <Hero />
        </div>
      </div>
    <div className="px-4 my-8">
  <ReviewsBento />
</div>

      {/*  <div className="px-4 my-8">
        <ProductCardWithSale />
      </div>*/}

      {/* <BrandStory /> */}
    </div>
  );
}
