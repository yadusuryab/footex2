import Poster2 from "@/public/poster-2.avif";
import Poster3 from "@/public/bogo-499.avif";
import Poster4 from "@/public/bogo-499-2.avif";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface HeroProps {
  filter: "999" | "499";
}

export function Hero({ filter }: HeroProps) {
  const slide = filter === "499" ? Poster3 : Poster2;
  const href = filter === "499" ? "/offer?price=499" : "/offer?price=1199";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <Image
          src={slide}
          alt={filter === "499" ? "BOGO at ₹499!" : "BOGO at ₹999!"}
          className="w-full h-auto rounded-3xl"
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw, 600px"
        />
        
        <div className="absolute bottom-4 right-4">
          <Button 
            size="sm"
            asChild
          >
            <Link href={href} prefetch>
              Claim offer
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}