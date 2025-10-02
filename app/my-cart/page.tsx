"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Tag, Gift, Truck, Shield } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on page load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setIsLoading(false);
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateSubtotal = () => 
    cartItems.reduce((total, item) => total + (item.offerPrice || item.price), 0);

  const calculateTotalItems = () => 
    cartItems.reduce((total, item) => total + (item.buyOneGetOne ? 2 : 1), 0);

  const calculateSavings = () => {
    const originalTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const discountedTotal = calculateSubtotal();
    return originalTotal - discountedTotal;
  };

  const hasBOGO = cartItems.some(item => item.buyOneGetOne);

  if (isLoading) {
    return (
      <main className="container mx-auto md:px-16 px-2 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto md:px-16 px-2 min-h-screen pb-8">
      <SHeading 
        title="Your Shopping Cart" 
        description="Review your selected items and proceed to checkout"
        nolink
      />

      {cartItems.length === 0 ? (
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Looks like you haven't added any products to your cart yet. Start shopping to find your perfect pair!
            </p>
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Items</h2>
                <p className="text-muted-foreground">
                  {calculateTotalItems()} item{calculateTotalItems() !== 1 ? 's' : ''} in your cart
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {cartItems.length} Product{cartItems.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item: any, index) => (
                <CartItem
                  key={`${item._id}-${index}`}
                  item={item}
                  onRemove={() => removeFromCart(item._id)}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Need more items?</h3>
                    <p className="text-sm text-muted-foreground">
                      Continue shopping to add more products to your order
                    </p>
                  </div>
                  <Link href="/">
                    <Button variant="outline" className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Review your order before checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({calculateTotalItems()})</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>

                {/* Savings */}
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discounts Applied
                    </span>
                    <span>-₹{calculateSavings()}</span>
                  </div>
                )}

                {/* BOGO Savings */}
                {hasBOGO && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span className="flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      BOGO Savings
                    </span>
                    <span>Free Items</span>
                  </div>
                )}

                <Separator />

                {/* Estimated Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Estimated Shipping
                  </span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>

                {/* Platform Fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Platform Fee
                  </span>
                  <span className="text-green-600">Included</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>

                {/* Savings Note */}
                {calculateSavings() > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 text-center">
                      You're saving ₹{calculateSavings()} on this order! 🎉
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full" size="lg" >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>🔒 Secure checkout</p>
                </div>
              </CardFooter>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center mx-auto mb-1">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span>Free Shipping</span>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center mx-auto mb-1">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span>Secure Payment</span>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center mx-auto mb-1">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span>Best Price</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}