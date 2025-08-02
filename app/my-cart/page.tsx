"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import CartItem from "@/components/cart/cart-item";
import SHeading from "@/components/utils/section-heading";

interface CartItem {
  _id: string;
  productName: string;
  shoeBrand: string;
  images: { asset: { url: string } }[];
  offerPrice?: number;
  price: number;
  selectedSize?: number;
  buyOneGetOne: boolean;
  freeProduct?: CartItem | null;
  freeProductSize?: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on page load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const calculateSubtotal = () => cartItems.reduce((total, item) => total + (item.offerPrice || item.price), 0);

  return (
    <main className="container mx-auto md:px-16 px-2">
    <SHeading title="Your Cart" description="Confirm your Products and Proceed to Checkout." nolink/>
     <div className="md:flex grid gap-2  w-full justify-between">
     <div className=" w-full grid gap-2">
     
        {cartItems.length === 0 ? (
          <p className="text-muted-foreground  text-sm font-semibold">Your cart is empty.</p>
        ) : (
          cartItems.map((item: any) => (
            <CartItem
            key={item._id}
            item={item}
            onRemove={()=>removeFromCart(item._id)}
          />
          ))
        )}
      </div>
      <div>
      {cartItems.length !== 0 && (
        <Card className=" max-w-[500px] w-full">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
          </CardContent>
          <CardFooter>
          
            <Link href="/checkout" className="w-full">
              <Button className="w-full" size={'lg'}>Proceed to Checkout</Button>
            </Link>
          
          </CardFooter>
        </Card>
      )}
      </div>
     </div>
    </main>
  );
}