import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Poster2 from "@/public/poster-2.avif";
import Poster3 from "@/public/bogo-499.avif";
import Poster4 from "@/public/bogo-499-2.avif";

import Link from "next/link";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";
import { useRouter } from "next/navigation";

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });

interface HeroProps {
  filter: "999" | "499";
}

export function Hero({ filter }: HeroProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const slideData =
    filter === "499"
      ? [
          {
            title: "BOGO at ₹499!",
            src: Poster3.src,
            href: "/offer?price=499",
            buttonText: "Claim ₹499 Offer",
          },
          {
            title: "BOGO at ₹499!",
            src: Poster4.src,
            href: "/offer?price=499",
            buttonText: "Claim ₹499 Offer",
          },
        ]
      : [
          {
            title: "BOGO at ₹999!",
            src: Poster2.src,
            href: "/offer?price=1199",
            buttonText: "Claim ₹999 Offer",
          },
        ];

  const handleOfferClick = (href: string, buttonText: string) => {
    setIsNavigating(true);
    setNavigatingTo(buttonText);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      router.push(href);
    }, 500);
  };

  React.useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
  }, [api]);

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Loading Your Offer!</h3>
              <p className="text-muted-foreground mt-1">
                Taking you to {navigatingTo}...
              </p>
            </div>
          </div>
        </div>
      )}

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="md:w-[500px] w-full mx-auto max-h-[500px] h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slideData.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <Image
                  width={1080}
                  height={1080}
                  className="w-full rounded-xl max-h-[500px] h-full object-contain cursor-pointer"
                  alt={slide.title}
                  src={slide.src}
                  loading="eager"
                  decoding="sync"
                  onClick={() => handleOfferClick(slide.href, slide.buttonText)}
                />
                <div className="absolute bottom-2 right-2">
                  <Button 
                    className="shadow-xl text-lg [&_svg]:size-6" 
                    size="lg"
                    onClick={() => handleOfferClick(slide.href, slide.buttonText)}
                    disabled={isNavigating}
                  >
                    {isNavigating && navigatingTo === slide.buttonText ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        {slide.buttonText}
                        <ArrowRightCircle className="fill-primary text-black w-6 h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-2xl p-2 rounded-full flex justify-center space-x-2 mt-2">
          {slideData.map((_, index) => (
            <div
              key={index}
              className={`h-2 shadow rounded-full transition-all ${
                currentIndex === index ? "bg-white w-4" : "bg-gray-400 w-2"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </>
  );
}