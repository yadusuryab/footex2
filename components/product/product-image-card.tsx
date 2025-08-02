"use client";
import * as React from "react";
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
  noLink?: boolean;
  ybg?: any;
  onClick?: () => void;
}

export default function ProductCard2({
  product,
  className = "",
  noLink = true,
  ybg = true,
  onClick,
}: ProductCardProps) {
  const { _id, productName, offerPrice, images, price } = product;
  const [isInCart, setIsInCart] = React.useState(false);

  React.useEffect(() => {
    setIsInCart(isProductInCart(_id));

    const handleCartUpdate = () => {
      setIsInCart(isProductInCart(_id));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [_id]);

  const imageUrl = images?.[0]?.asset?.url ?? "/placeholder-image.jpg";

  const cardContent = (
    <div onClick={noLink ? onClick : undefined}>
      <ImageCard
        caption={productName}
        price={price}
        offerprice={offerPrice}
        imageUrl={imageUrl}
        className={className}
        ybg={ybg}
      />
    </div>
  );

  return noLink ? cardContent : <Link href={`/p/${_id}`}>{cardContent}</Link>;
}
