"use client";

import Image from "next/image";
import { useState } from "react";

// Add your filenames from public/reviews here
const REVIEW_IMAGES = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
];

function splitIntoColumns(items: string[], count: number) {
  const cols: string[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

const DURATIONS = [28, 35, 22, 40]; // seconds, one per column

function MarqueeColumn({
  images,
  duration,
  reverse,
  onSelect,
}: {
  images: string[];
  duration: number;
  reverse?: boolean;
  onSelect: (src: string) => void;
}) {
  const loopImages = [...images, ...images];

  return (
    <div className="relative h-full  rounded-xl overflow-hidden">
      <div
        className="flex flex-col gap-4  animate-marquee"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loopImages.map((src, i) => (
          <button
            key={i}
            onClick={() => onSelect(src)}
            className="relative w-full aspect-[9/16] shadow-lg rounded-xl overflow-hidden shadow-md cursor-pointer group"
          >
            <Image
              src={`/reviews/${src}`}
              alt="Customer review"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const mobileCols = splitIntoColumns(REVIEW_IMAGES, 2);
  const desktopCols = splitIntoColumns(REVIEW_IMAGES, 4);

  return (
    <section className="w-screen h-screen flex flex-col px-4">
      <h2 className="text-center text-3xl font-semibold  mb-6 shrink-0">
        Happy Customers
      </h2>

      {/* Mobile: 2 columns */}
      <div className="grid grid-cols-2 gap-4  flex-1 min-h-0 md:hidden">
        {mobileCols.map((col, i) => (
          <MarqueeColumn
            key={i}
            images={col}
            duration={DURATIONS[i]}
            reverse={i % 2 === 1}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden md:grid grid-cols-4 gap-4 flex-1 min-h-0">
        {desktopCols.map((col, i) => (
          <MarqueeColumn
            key={i}
            images={col}
            duration={DURATIONS[i]}
            reverse={i % 2 === 1}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Fullscreen review viewer */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="absolute top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-sm aspect-[9/16]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/reviews/${selected}`}
              alt="Customer review"
              fill
              className="object-contain rounded-xl"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}