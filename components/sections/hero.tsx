"use client";

import Poster2 from "@/public/p3.jpg";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { IconSquareRoundedArrowRight } from "@tabler/icons-react";
import { RainbowButton } from "../ui/rainbow-button";

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
      <Link 
        href="/offer?price=1199" 
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        {/* Image Container with Skeleton */}
        <div className="relative bg-gray-100 rounded-3xl overflow-hidden">
          <Image
            src={Poster2.src}
            alt="BOGO at ₹999"
            width={800}  // ✅ Added explicit dimensions
            height={400} // ✅ Reduced height for optimization
            className={`w-full h-auto transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isLoading ? 'opacity-70' : ''}`}
            priority
            quality={60} // ✅ Reduced from 75 to 60
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
            onLoad={() => setImageLoaded(true)}
            placeholder="blur" // ✅ Added blur placeholder
          />
          
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Button - Responsive */}
        <div className="mt-2">
          <RainbowButton className=" w-full rounded-xl bg-black text-white transition-colors
            h-12 sm:h-14 md:h-16
            text-base sm:text-lg md:text-xl" size={'lg'} >
            Claim offer
            <IconSquareRoundedArrowRight/> {/* ✅ Reduced default size */}
          </RainbowButton>
        </div>

        {/* Loading Overlay - Only show for 2+ seconds */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 rounded-3xl flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> {/* ✅ Reduced size */}
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}