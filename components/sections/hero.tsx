import Poster2 from "@/public/poster-2.avif";
import Poster3 from "@/public/bogo-499.avif";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";

interface HeroProps {
  filter: "999" | "499";
}

export function Hero({ filter }: HeroProps) {
  const [isLoading, setIsLoading] = useState(false);
  const slide = filter === "499" ? Poster3 : Poster2;
  const href = filter === "499" ? "/offer?price=499" : "/offer?price=1199";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link 
        href={href} 
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        <Image
          src={slide}
          alt={filter === "499" ? "BOGO at ₹499!" : "BOGO at ₹999!"}
          className={`w-full h-auto rounded-3xl transition-all duration-200 ${
            isLoading ? 'opacity-80' : 'group-hover:brightness-110'
          }`}
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw, 600px"
        />
        
        {/* Always visible button */}
        <div className="absolute bottom-4 right-4">
          <Button 
           
            className="bg-black text-white font-bold"
          >
            Claim offer
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Simple loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}