import Poster2 from "@/public/poster-2.avif";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { IconSquareRoundedArrowRight } from "@tabler/icons-react";

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <Link 
        href="/offer?price=1199" 
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        {/* Image Container with Skeleton */}
        <div className="relative bg-gray-100 rounded-t-3xl overflow-hidden">
          <Image
            src={Poster2}
            alt="BOGO at ₹999!"
            className={`w-full h-auto transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isLoading ? 'opacity-70' : ''}`}
            priority
            quality={75}
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Button - Responsive */}
        <div className="mt-0">
          <Button className="bg-black w-full text-white font-bold rounded-b-xl rounded-t-none hover:bg-gray-900 transition-colors
            h-12 sm:h-14 md:h-16
            text-base sm:text-lg md:text-xl">
            Claim offer
            <IconSquareRoundedArrowRight className=" w-8 h-8 sm:w-8 sm:h-8" />
          </Button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 rounded-3xl flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}