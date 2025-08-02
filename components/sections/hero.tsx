import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Poster from "@/public/bogo-poster.jpg";
import Poster2 from "@/public/bogo-2.png";
import Poster3 from "@/public/bogo-499.png";

import Link from "next/link";
import { ArrowRight, ArrowRightCircle, ArrowUpRightFromCircle } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: ["400"] });
interface HeroProps {
  filter: "999" | "499";
}

export function Hero({ filter }: HeroProps) {
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
            src: Poster3.src, // <-- change to your actual 499 image
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
          {
            title: "₹999 Special Offer",
            src: Poster.src,
            href: "/offer?price=1199",
            buttonText: "Claim ₹999 Offer",
          },
        ];

  React.useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
  }, [api]);

  return (
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
            <Link href={slide.href}>
              <div className="relative">
                <Image
                  width={1080}
                  height={1080}
                  className="w-full rounded-xl max-h-[500px] h-full object-contain"
                  alt={slide.title}
                  src={slide.src}
                  loading="eager"
                  decoding="sync"
                />
                <div className="absolute bottom-2 right-2">
                  <Link href={slide.href}>
                    <Button className="shadow-xl text-lg [&_svg]:size-6" size="lg">
                      {slide.buttonText}
                      <ArrowRightCircle className="fill-priamry text-black w-6 h-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Link>
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
  );
}

