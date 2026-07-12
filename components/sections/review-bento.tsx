"use client";

import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ReviewsBackground() {
  return (
    <div className="absolute inset-0 flex gap-3 p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
      <div className="relative flex-1 rounded-xl overflow-hidden -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/reviews/1.jpg"
          alt="Customer review"
          fill
          className="object-cover"
          sizes="20vw"
        />
      </div>
      <div className="relative flex-1 rounded-xl overflow-hidden translate-y-6 rotate-3 group-hover:rotate-0 group-hover:translate-y-2 group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/reviews/2.jpg"
          alt="Customer review"
          fill
          className="object-cover"
          sizes="20vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
  );
}

export function ReviewsBento() {
  return (
    <BentoGrid className="grid-cols-1">
      <BentoCard
        name="Happy Customers"
        description="Real reviews from real people. See what everyone's saying."
        Icon={ChatIcon}
        href="/reviews"
        cta="View all reviews"
        background={<ReviewsBackground />}
        className="col-span-1"
      />
    </BentoGrid>
  );
}