// components/cart/cart-buttons/cart-count.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CartButtonProps {
  showLabel?: boolean;
}

export default function CartButton({ showLabel = false }: CartButtonProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const totalItems = cartItems.reduce((total, item) => {
    return total + (item.buyOneGetOne && item.freeProduct ? 2 : 1);
  }, 0);

  if (showLabel) {
    return (
      <Link href="/my-cart">
      <Button
        variant={'secondary'}
        size="sm"
        className="relative"
      >
      
          
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center px-1 text-xs bg-green-500 text-primary-foreground border-0"
                variant="default"
              >
                {totalItems}
              </Badge>
            )}
          
          <span className="text-xs font-medium">Cart</span>
       
      </Button> </Link>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      asChild
    >
      <Link href="/cart">
        <ShoppingBag className="h-4 w-4" />
        {totalItems > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 min-w-5 flex border-white/30 items-center text-white backdrop-blur-sm justify-center px-1 text-xs "
            variant="outline"
          >
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
}