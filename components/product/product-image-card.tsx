"use client";
import React, { useState } from "react";
import Image from "next/image"; // ✅ Use Next.js Image component

export interface Product {
  _id: string;
  productName: string;
  price: number;
  isOffer?: boolean;
  offerPrice?: number;
  buyOneGetOne?: boolean;
  imageUrl?: string;
}

interface ProductCardProps {
  product: any;
  className?: string;
  variant?: "grid";
  noLink?: boolean;
  onClick?: () => void;
}

export default function ProductCard2({
  product,
  className = "",
  noLink = true,
  onClick,
}: ProductCardProps) {
  const { productName, price, offerPrice, imageUrl } = product;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardContent = (
    <div 
      onClick={onClick}
      className={`rounded-2xl overflow-hidden cursor-pointer ${className}`}
    >
      {/* ✅ OPTIMIZED Image with Next.js Image component */}
      <div className="aspect-square relative bg-gray-100 rounded-2xl overflow-hidden">
        {!imageError ? (
          <>
            <Image
              src={imageUrl || "/placeholder-image.jpg"}
              alt={productName || "Product image"}
              width={280} // ✅ Fixed dimensions for better optimization
              height={280}
              quality={45} // ✅ Reduced from likely 75-85 to 45
              priority={false} // ✅ Never use priority for product listings
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy" // ✅ Lazy load all product images
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 280px" // ✅ Proper sizing
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              placeholder="blur" // ✅ Add blur placeholder
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R" // ✅ Small base64 placeholder
            />
            
            {/* ✅ Skeleton loader while image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          // ✅ Fallback for image error
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Image not available</span>
          </div>
        )}
      </div>
      
      {/* ✅ Optional: Add product info if needed */}
      {/* <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{productName}</h3>
        <div className="flex items-center gap-2 mt-1">
          {offerPrice ? (
            <>
              <span className="text-sm font-semibold">₹{offerPrice}</span>
              <span className="text-xs text-gray-500 line-through">₹{price}</span>
            </>
          ) : (
            <span className="text-sm font-semibold">₹{price}</span>
          )}
        </div>
      </div> */}
    </div>
  );

  return cardContent;
}