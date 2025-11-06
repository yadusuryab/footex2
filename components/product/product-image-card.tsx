"use client";
import React from "react";

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

  const cardContent = (
    <div 
      onClick={onClick}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      {/* Optimized image with better quality */}
      <div className="aspect-square relative">
        <img
          src={imageUrl || "/placeholder-image.jpg"}
          alt={productName}
          className="w-full h-full object-cover"
          loading="lazy"
          width={250}
          height={250}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
      
      {/* Product info */}
     
    </div>
  );

  return cardContent;
}