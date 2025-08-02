"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { isProductInCart } from "@/lib/cart";
import ImageCard from "../ui/image-card";

export interface Product {
  _id: string;
  productName: string;
  shoeBrand: string;
  category: string;
  sizes: number[];
  colorVariants: string[];
  images: { asset: { url: string } }[];
  description: string;
  madeIn: string;
  price: number;
  isOffer: boolean;
  offerPrice?: number;
  buyOneGetOne: boolean;
}

export interface ProductCardProps {
  product: Product;
  className?: string;
  noLink?: boolean; // New option to disable linking
  onClick?: () => void; // Optional click handler for `noLink`
}

export default function ProductCard2({
  product,
  className = "",
  noLink = true,
  ybg = true,
  onClick,
}: any) {
  const { _id, productName, shoeBrand,offerPrice, category, images,price } = product;
  const [isInCart, setIsInCart] = React.useState(false);

  // Check if the product is already in the cart on mount
  React.useEffect(() => {
    setIsInCart(isProductInCart(_id));

    const handleCartUpdate = () => {
      setIsInCart(isProductInCart(_id));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [_id]);

  const cardContent = (
    <div
      onClick={noLink ? onClick : undefined}
      // Prevent navigation when `noLink` is true
    >
      {/* Product Image */}

      <ImageCard
        caption={`${productName}`}
        price={price}
        offerprice={offerPrice}
        imageUrl={images[0]?.asset.url || "/placeholder-image.jpg"}
        className={className}
        ybg={ybg}
      ></ImageCard>
    </div>
  );

  return noLink ? cardContent : <Link href={`/p/${_id}`}>{cardContent}</Link>;
}
