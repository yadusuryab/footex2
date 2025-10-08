"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Tag, Gift, Truck, Shield, Star, Info, Package, Zap } from "lucide-react";
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

  // Calculate total amount (only paid items: ₹999 + extra charges)
  const calculateTotalAmount = () => 
    cartItems.reduce((total, item) => {
      const productPrice = item.offerPrice || item.price;
      const extraAmount = Math.max(0, productPrice - 999);
      
      // Only charge for the main product (₹999 + extra charges)
      let itemTotal = 999 + extraAmount;

      // Free products get their extra charges added too
      if (item.buyOneGetOne && item.freeProduct) {
        const freeProductPrice = item.freeProduct.price || 999;
        const freeProductExtraAmount = Math.max(0, freeProductPrice - 999);
        itemTotal += freeProductExtraAmount; // Only add extra charges for free product
      }

      return total + itemTotal;
    }, 0);

  // Calculate base price for paid items only
  const calculateBasePrice = () => 
    cartItems.length * 999; // Only count paid items

  // Calculate total extra amount for all products (paid + free)
  const calculateTotalExtraAmount = () => 
    cartItems.reduce((total, item) => {
      const productPrice = item.offerPrice || item.price;
      const extraAmount = Math.max(0, productPrice - 999);
      
      let totalExtra = extraAmount;

      // Free product extra amount
      if (item.buyOneGetOne && item.freeProduct) {
        const freeProductPrice = item.freeProduct.price || 999;
        const freeProductExtraAmount = Math.max(0, freeProductPrice - 999);
        totalExtra += freeProductExtraAmount;
      }

      return total + totalExtra;
    }, 0);

  // Calculate total items including free products
  const calculateTotalItems = () => 
    cartItems.reduce((total, item) => total + (item.buyOneGetOne && item.freeProduct ? 2 : 1), 0);

  // Calculate total paid items (excluding free products)
  const calculatePaidItems = () => cartItems.length;

  // Calculate free items count
  const calculateFreeItems = () => 
    cartItems.filter(item => item.buyOneGetOne && item.freeProduct).length;

  // Calculate savings from BOGO (base value of free products)
  const calculateBOGOSavings = () => 
    cartItems.reduce((total, item) => {
      if (item.buyOneGetOne && item.freeProduct) {
        return total + 999; // Base value of free product
      }
      return total;
    }, 0);

  // Calculate discount savings (from offer prices)
  const calculateDiscountSavings = () => {
    const originalTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const currentTotal = cartItems.reduce((total, item) => total + (item.offerPrice || item.price), 0);
    return Math.max(0, originalTotal - currentTotal);
  };

  // Get detailed breakdown of extra charges
  const getDetailedExtraCharges = () => {
    return cartItems.map((item) => {
      const productPrice = item.offerPrice || item.price;
      const extraAmount = Math.max(0, productPrice - 999);
      
      let freeProductExtraAmount = 0;
      let freeProductName = '';
      
      if (item.buyOneGetOne && item.freeProduct) {
        const freeProductPrice = item.freeProduct.price || 999;
        freeProductExtraAmount = Math.max(0, freeProductPrice - 999);
        freeProductName = item.freeProduct.productName;
      }

      return {
        mainProduct: {
          name: item.productName,
          extraAmount: extraAmount
        },
        freeProduct: freeProductName ? {
          name: freeProductName,
          extraAmount: freeProductExtraAmount
        } : null,
        totalExtra: extraAmount + freeProductExtraAmount
      };
    });
  };

  const hasBOGO = cartItems.some(item => item.buyOneGetOne);
  const hasExtraCharges = calculateTotalExtraAmount() > 0;
  const totalSavings = calculateBOGOSavings() + calculateDiscountSavings();
  const detailedExtraCharges = getDetailedExtraCharges();

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
                  {calculateFreeItems() > 0 && (
                    <span className="text-green-600 ml-2">
                      ({calculateFreeItems()} free)
                    </span>
                  )}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {cartItems.length} Paid Product{cartItems.length !== 1 ? 's' : ''}
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
                  Detailed breakdown of your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Base Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Base Price ({calculatePaidItems()} paid items × ₹999)
                    </span>
                    <span>₹{calculateBasePrice()}</span>
                  </div>

                  {/* Free Items Note */}
                  {hasBOGO && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="text-muted-foreground">
                        + Free Items ({calculateFreeItems()} products)
                      </span>
                      <span>₹0</span>
                    </div>
                  )}

                  {/* Total Items Summary */}
                  <div className="flex justify-between text-sm font-medium border-b pb-2">
                    <span>Total Items ({calculateTotalItems()} items)</span>
                    <span>₹{calculateBasePrice()}</span>
                  </div>
                </div>

                {/* Extra Charges Section */}
                {hasExtraCharges && (
                  <div className="space-y-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                      <Info className="h-4 w-4" />
                      <span>Premium Product Charges</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-amber-700">
                      {detailedExtraCharges.map((detail, index) => {
                        if (detail.totalExtra === 0) return null;
                        
                        return (
                          <div key={index} className="space-y-1">
                            {/* Main Product Extra */}
                            {detail.mainProduct.extraAmount > 0 && (
                              <div className="flex justify-between">
                                <span className="flex-1 pr-2">
                                  <span className="font-medium">{detail.mainProduct.name}</span>
                                  <span className="text-xs block text-amber-600">(Premium upgrade)</span>
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                  +₹{detail.mainProduct.extraAmount}
                                </span>
                              </div>
                            )}
                            
                            {/* Free Product Extra */}
                            {detail.freeProduct && detail.freeProduct.extraAmount > 0 && (
                              <div className="flex justify-between">
                                <span className="flex-1 pr-2">
                                  <span className="font-medium">{detail.freeProduct.name}</span>
                                  <span className="text-xs block text-amber-600">(Free product premium upgrade)</span>
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                  +₹{detail.freeProduct.extraAmount}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between text-sm font-medium text-amber-800 border-t border-amber-300 pt-2">
                      <span>Total Extra Charges</span>
                      <span>+₹{calculateTotalExtraAmount()}</span>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between text-base font-semibold">
                  <span>Subtotal</span>
                  <span>₹{calculateTotalAmount()}</span>
                </div>

                {/* Savings Breakdown */}
                {(calculateDiscountSavings() > 0 || hasBOGO) && (
                  <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                      <Tag className="h-4 w-4" />
                      <span>Your Savings</span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-green-700">
                      {calculateDiscountSavings() > 0 && (
                        <div className="flex justify-between">
                          <span>Discounts Applied</span>
                          <span>-₹{calculateDiscountSavings()}</span>
                        </div>
                      )}
                      
                      {hasBOGO && (
                        <div className="flex justify-between">
                          <span>BOGO Free Products ({calculateFreeItems()} items)</span>
                          <span>-₹{calculateBOGOSavings()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-sm font-medium text-green-800 border-t border-green-300 pt-2">
                      <span>Total Savings</span>
                      <span>-₹{totalSavings}</span>
                    </div>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Estimated Shipping
                  </span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>

                <Separator />

                {/* Final Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{calculateTotalAmount()}</span>
                </div>

                {/* Pricing Explanation */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 text-xs text-blue-700">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium">How pricing works:</p>
                      <ul className="space-y-1">
                        <li>• You pay ₹999 base price for each product you add to cart</li>
                        <li>• Premium products have extra charges above ₹999</li>
                        <li>• BOGO offers give you free products (only pay extra charges if premium)</li>
                        <li>• Extra charges apply to premium free products too</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout - ₹{calculateTotalAmount()}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure checkout
                  </p>
                  {hasExtraCharges && (
                    <p className="text-amber-600">
                      Includes extra charges for premium products
                    </p>
                  )}
                  {hasBOGO && (
                    <p className="text-green-600">
                      You're getting {calculateFreeItems()} free product{calculateFreeItems() !== 1 ? 's' : ''}!
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center mx-auto mb-1">
                      <Star className="h-4 w-4" />
                    </div>
                    <span>Quality Guaranteed</span>
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