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
  image?: string; // This is what we need
  imageUrl?: string; // Alternative name
  images?: Array<{ asset: { url: string } }>; // Original format
  buyOneGetOne?: boolean;
  freeProduct?: CartItem;
}

type CheckoutStep = "payment" | "details";

// FIXED: Safe image URL getter that handles all possible image properties
const getProductImageUrl = (product: any): string => {
  if (!product) return "/placeholder-image.jpg";
  
  // Try all possible image properties in order of priority
  if (product.image && typeof product.image === 'string') return product.image;
  if (product.imageUrl && typeof product.imageUrl === 'string') return product.imageUrl;
  if (product.images?.[0]?.asset?.url) return product.images[0].asset.url;
  if (product.images?.[0]?.url) return product.images[0].url;
  
  return "/placeholder-image.jpg";
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">("online");
  const [shippingCharge, setShippingCharge] = useState(100);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
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
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("Cart items:", cart); // Debug log to see what's in cart
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  }, []);

  // Safe product access
  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;
  
  // Debug logs to see product structure
  useEffect(() => {
    if (mainProduct) {
      console.log("Main product:", mainProduct);
      console.log("Main product image URL:", getProductImageUrl(mainProduct));
    }
    if (freeProduct) {
      console.log("Free product:", freeProduct);
      console.log("Free product image URL:", getProductImageUrl(freeProduct));
    }
  }, [mainProduct, freeProduct]);
  
  // Safe price calculations
  const basePrice = 999;
  const pair1Price = Number(mainProduct?.price) || 999;
  const pair2Price = Number(freeProduct?.price) || 999;
  
  const pair1Extra = Math.max(0, pair1Price - 999);
  const pair2Extra = Math.max(0, pair2Price - 999);
  
  const subtotal = basePrice + pair1Extra + pair2Extra;
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

  const validateForm = (): boolean => {
    const errors: string[] = [];

    
    // Validate contact number format
    if (customerDetails.contact1 && !/^\d{10}$/.test(customerDetails.contact1.replace(/\D/g, ''))) {
      errors.push("Contact number must be 10 digits");
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
  
    try {
      const phone = site.phone;
      const mainProduct = cartItems[0];
      const freeProduct = mainProduct?.freeProduct;

      const productMessages = cartItems
        .map((item, idx) => {
          const productLink = `https://footex.in/p/${item._id}`;
          const extra = Math.max(0, (item.price || 999) - 999);
          
          let message = `*PAIR ${idx + 1}*\n`;
          message += `Product: ${item.productName?.toUpperCase() || 'Unknown Product'}\n`;
          message += `Size: ${item.selectedSize || 'N/A'}\n`;
          message += `Extra: ₹${extra}\n`;
          message += `Link: ${productLink}`;
    
          if (item.buyOneGetOne && item.freeProduct) {
            const freeProductLink = `https://footex.in/p/${item.freeProduct._id}`;
            const freeProductExtraAmount = Math.max(0, (item.freeProduct.price || 999) - 999);
            
            message += `\n\n*PAIR ${idx + 2}*\n`;
            message += `Product: ${item.freeProduct.productName?.toUpperCase() || 'Unknown Product'}\n`;
            message += `Size: ${item.freeProduct.selectedSize || 'N/A'}\n`;
            message += `Extra: ₹${freeProductExtraAmount}\n`;
            message += `Link: ${freeProductLink}`;
          }
    
          return message;
        })
        .join("\n\n");
    
      const customerMsg = `
*2 PAIR${cartItems.length > 1 ? 'S' : ''} SHOES ORDER*\n\n${productMessages}\n\n*CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n*ORDER SUMMARY*\nBase Price: ₹${basePrice}\nPair 1 Extra: ₹${pair1Extra}\nPair 2 Extra: ₹${pair2Extra}\nShipping Method: ${shippingMethod === "online" ? "Online Payment" : "Cash on Delivery"}\nShipping Charge: ₹${shippingCharge}\n*GRAND TOTAL: ₹${totalAmount}*
      `.trim();
    
      const encodedMsg = encodeURIComponent(customerMsg);
    
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
        localStorage.removeItem("cart");
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error creating order:", error);
      setIsLoading(false);
      setFormErrors(["Failed to create order. Please try again."]);
    }
  };

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

  // Early return if no cart items
  if (!cartItems.length) {
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

  // Safe product check before rendering
  if (!mainProduct) {
    return (
      <main className="container mx-auto px-4 max-w-md min-h-screen flex items-center justify-center">
        <Card className="w-full text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Invalid Cart</h2>
            <p className="text-muted-foreground mb-6">
              Your cart contains invalid items.
            </p>
            <Button onClick={() => {
              localStorage.removeItem("cart");
              router.push("/");
            }} className="w-full">
              Start Over
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

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
              {/* FIXED: Product Images with better error handling */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Your Selected Pairs</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-500">
                      <img
                        src={getProductImageUrl(mainProduct)}
                        alt={mainProduct.productName || "Main Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Failed to load main product image:", getProductImageUrl(mainProduct));
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                        onLoad={() => console.log("Main product image loaded successfully")}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{mainProduct.productName || "Product"}</p>
                      <p className="text-xs text-muted-foreground">Size: {mainProduct.selectedSize || "N/A"}</p>
                      <Badge variant="default" className="mt-1">1st Pair</Badge>
                    </div>
                  </div>

                  {freeProduct && (
                    <div className="flex-1">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-green-500">
                        <img
                          src={getProductImageUrl(freeProduct)}
                          alt={freeProduct.productName || "Free Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Failed to load free product image:", getProductImageUrl(freeProduct));
                            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                          }}
                          onLoad={() => console.log("Free product image loaded successfully")}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">{freeProduct.productName || "Free Product"}</p>
                        <p className="text-xs text-muted-foreground">Size: {freeProduct.selectedSize || "N/A"}</p>
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

              <div className="mt-6">
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-lg font-semibold flex items-center gap-2"
                  size="lg"
                >
                  Continue to Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
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

  // Step progress component (you had this commented out)
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

        {/* Order Summary */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Base Price</span>
                <span>₹{basePrice}</span>
              </div>
              
              {pair1Extra > 0 && (
                <div className="flex justify-between text-sm text-green-600 ml-4">
                  <span>Extra Amount (Pair 1)</span>
                  <span>+ ₹{pair1Extra}</span>
                </div>
              )}
              
              {pair2Extra > 0 && (
                <div className="flex justify-between text-sm text-green-600 ml-4">
                  <span>Extra Amount (Pair 2)</span>
                  <span>+ ₹{pair2Extra}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Shipping ({shippingMethod === "online" ? "Online Payment" : "Cash on Delivery"})</span>
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
      {currentStep === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold flex items-center gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preparing Order...
                </>
              ) : (
                `Order via WhatsApp - ₹${totalAmount}`
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              You'll be redirected to WhatsApp to confirm your order
            </p>
          </div>
        </div>
      )}
    </main>
  );
}