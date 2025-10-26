"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingBag, CheckCircle2, Zap, Truck, ArrowRight } from "lucide-react";

import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import Link from "next/link";

interface CartItem {
  _id: string;
  productName: string;
  selectedSize: string;
  price: number;
  images: Array<{ asset: { url: string } }>;
  buyOneGetOne?: boolean;
  freeProduct?: CartItem;
}

type CheckoutStep = "payment" | "details";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">("online");
  const [shippingCharge, setShippingCharge] = useState(100);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    contact1: "",
    contact2: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    instagramId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  // Calculate totals

  const subtotal = cartItems.reduce((sum, item:any) => sum + (item.price || 999) + (item.freeProduct?.price - 999), 0);
  const totalAmount = subtotal + shippingCharge;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const handleWhatsAppOrder = () => {
    setIsLoading(true);
  
    const phone = site.phone;
    const mainProduct = cartItems[0];
    const freeProduct = mainProduct?.freeProduct;
  
    const productMessages = cartItems
      .map((item, idx) => {
        const productLink = `https://footex.in/p/${item._id}`;
        const productPrice = item.price || 999;
        const extra = item.price - 999;
        
        let message = `*PAIR ${idx + 1}*\n`;
        message += `Product: ${item.productName.toUpperCase()}\n`;
        message += `Size: ${item.selectedSize}\n`;
        message += `Price: ₹${productPrice - extra}\n`;
        message += `Extra: ₹${extra}\n`;
        message += `Link: ${productLink}`;
  
        if (item.buyOneGetOne && item.freeProduct) {
          const freeProductLink = `https://footex.in/p/${item.freeProduct._id}`;
          const freeProductPrice = item.freeProduct.price || 999;
          const freeProductExtraAmount = freeProductPrice > 999 ? freeProductPrice - 999 : 0;
          
          message += `\n\n*PAIR ${idx + 2}*\n`;
          message += `Product: ${item.freeProduct.productName.toUpperCase()}\n`;
          message += `Size: ${item.freeProduct.selectedSize}\n`;
          message += `Price: ₹0 \n`;
          message += `Extra: ₹${freeProductExtraAmount}\n`;
          message += `Link: ${freeProductLink}`;
        }
  
        return message;
      })
      .join("\n\n");
  
    // Calculate according to your logic: first shoe full price + free shoe extra amount only
    let calculatedTotal = 0;
    
    // First shoe - full price
    if (cartItems.length > 0) {
      calculatedTotal += cartItems[0].price || 999;
    }
    
    // Free shoe - only extra amount
    if (mainProduct?.freeProduct) {
      const freeProductPrice = mainProduct.freeProduct.price || 999;
      const freeProductExtraAmount = freeProductPrice > 999 ? freeProductPrice - 999 : 0;
      calculatedTotal += freeProductExtraAmount;
    }
    
    // Add shipping
    calculatedTotal += shippingCharge;
  
    const customerMsg = `
  *2 PAIR${cartItems.length > 1 ? 'S' : ''} SHOES ORDER*\n\n${productMessages}\n\n*CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n*ORDER SUMMARY*\nFirst Pair: ₹${cartItems[0]?.price || 999}\nFree Pair Extra Amount: ₹${mainProduct?.freeProduct ? Math.max(0, (mainProduct.freeProduct.price || 999) - 999) : 0}\nShipping Charge: ₹${shippingCharge}\n*GRAND TOTAL: ₹${calculatedTotal}*
    `.trim();
  
    const encodedMsg = encodeURIComponent(customerMsg);
  
    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
      setIsLoading(false);
      localStorage.removeItem("cart");
    }, 500);
  };
  const isFormValid =
    customerDetails.name &&
    customerDetails.contact1 &&
    customerDetails.address &&
    customerDetails.district &&
    customerDetails.state &&
    customerDetails.pincode &&
    customerDetails.instagramId;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep === "payment") {
      setCurrentStep("details");
    } else {
      handleWhatsAppOrder();
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto px-4 max-w-md min-h-screen flex items-center justify-center">
        <Card className="w-full text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some stylish shoes to get started!
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;

  const renderStepContent = () => {
    switch (currentStep) {
      case "payment":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Product Images */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Your Selected Pairs</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-500">
                      <img
                        src={mainProduct.images[0]?.asset.url}
                        alt={mainProduct.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{mainProduct.productName}</p>
                      <p className="text-xs text-muted-foreground">Size: {mainProduct.selectedSize}</p>
                      <Badge variant="default" className="mt-1">1st Pair</Badge>
                    </div>
                  </div>

                  {freeProduct && (
                    <div className="flex-1">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-green-500">
                        <img
                          src={freeProduct.images[0]?.asset.url}
                          alt={freeProduct.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">{freeProduct.productName}</p>
                        <p className="text-xs text-muted-foreground">Size: {freeProduct.selectedSize}</p>
                        <Badge variant="secondary" className="mt-1 bg-green-600 text-white">2nd Pair</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <RadioGroup
                value={shippingMethod}
                onValueChange={(value: "online" | "cod") => {
                  setShippingMethod(value);
                  setShippingCharge(value === "online" ? 100 : 300);
                }}
                className="space-y-3"
              >
                <div
                  className={`flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    shippingMethod === "online"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setShippingMethod("online");
                    setShippingCharge(100);
                  }}
                >
                  <RadioGroupItem value="online" id="online" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="online" className="font-medium cursor-pointer">
                        Online Payment
                      </Label>
                      <Badge variant="default" className="bg-green-600 text-white">
                        ₹100
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Zap className="h-3 w-3" />
                        <span>Save ₹200</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Truck className="h-3 w-3" />
                        <span>Fast delivery (5-8 days)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    shippingMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setShippingMethod("cod");
                    setShippingCharge(300);
                  }}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cod" className="font-medium cursor-pointer">
                        Cash on Delivery
                      </Label>
                      <Badge variant="secondary">₹300</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Pay when you receive the order</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case "details":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Delivery Information
              </CardTitle>
              <CardDescription>
                Enter your details for order delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerDetailsForm
                customerDetails={customerDetails}
                handleInputChange={handleInputChange}
              />
            </CardContent>
          </Card>
        );
    }
  };

  const getStepProgress = () => {
    const steps = [
      { number: 1, label: "Payment", key: "payment" as CheckoutStep },
      { number: 2, label: "Details", key: "details" as CheckoutStep },
    ];

    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.key 
                    ? "bg-primary text-primary-foreground" 
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {steps.findIndex(s => s.key === currentStep) > index ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs mt-1">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-1 ${
                  steps.findIndex(s => s.key === currentStep) > index 
                    ? "bg-green-500" 
                    : currentStep === step.key
                    ? "bg-primary"
                    : "bg-muted"
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 max-w-2xl min-h-screen pb-24">
      <div className="py-4">
        {getStepProgress()}

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {/* Simple Order Summary */}
        <Card className="mt-6">
  <CardContent className="pt-6">
    <div className="space-y-3">
      {/* Display individual product prices and extra amounts */}
      {cartItems.map((item, index) => {
        const itemPrice = item.price || 999;
        const extraAmount = itemPrice > 999 ? itemPrice - 999 : 0;
        
        return (
          <div key={item._id}>
            <div className="flex justify-between text-sm">
              <span>Pair {index + 1} - {item.productName}</span>
              <span>₹{itemPrice - extraAmount}</span>
            </div>
            {extraAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600 ml-4">
                <span>Extra Amount (Pair {index + 1})</span>
                <span>+ ₹{extraAmount}</span>
              </div>
            )}
            
            {/* Free product details */}
            {item.freeProduct && (
              <>
                <div className="flex justify-between text-sm ">
                  <span>Pair {index + 2} - {item.freeProduct.productName}</span>
                  <span>₹0</span>
                </div>
                {(item.freeProduct.price || 999) > 999 && (
                  <div className="flex justify-between text-sm text-green-600 ml-4">
                    <span>Extra Amount (Pair {index + 2})</span>
                    <span>+ ₹{(item.freeProduct.price || 999) - 999}</span>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
      
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>₹{shippingCharge}</span>
      </div>
      <div className="border-t pt-3 flex justify-between font-semibold">
        <span>Total Amount</span>
        <span>₹{totalAmount}</span>
      </div>
    </div>
  </CardContent>
</Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            onClick={handleContinue}
            disabled={
              (currentStep === "details" && (!isFormValid || isLoading)) ||
              isLoading
            }
            className="w-full h-12 text-lg font-semibold flex items-center gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Preparing Order...
              </>
            ) : currentStep === "details" ? (
              `Order via WhatsApp - ₹${totalAmount}`
            ) : (
              <>
                Continue to Details
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          
          {currentStep === "details" && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              You'll be redirected to WhatsApp to confirm your order
            </p>
          )}
        </div>
      </div>
    </main>
  );
}