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
import { Loader2, ShoppingBag, Truck, CheckCircle2, Info, CheckCircle, Zap, ArrowRight } from "lucide-react";

import SHeading from "@/components/utils/section-heading";
import {
  calculateSubtotal,
  calculateTotalAmount,
  CartItem,
  validateForm,
} from "@/lib/orderUtils";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import Link from "next/link";

interface ShippingMethod {
  id: "online" | "cod";
  name: string;
  description: string;
  charge: number;
  icon: React.ReactNode;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: "online",
    name: "Online Payment",
    description: "Pay now & get faster delivery",
    charge: 100,
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive the order",
    charge: 300,
    icon: <ShoppingBag className="h-5 w-5" />,
  },
];

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

  const subtotal = calculateSubtotal(cartItems);
  const totalAmount = calculateTotalAmount(subtotal, shippingCharge);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const validateFormBeforeSubmit = () => {
    const errors: string[] = [];

    if (!customerDetails.name.trim()) errors.push("Name is required");
    if (!customerDetails.contact1.trim()) errors.push("Contact number is required");
    if (!customerDetails.address.trim()) errors.push("Address is required");
    if (!customerDetails.district.trim()) errors.push("District is required");
    if (!customerDetails.state.trim()) errors.push("State is required");
    if (!customerDetails.pincode.trim()) errors.push("Pincode is required");
    if (!customerDetails.instagramId.trim()) errors.push("Instagram ID is required");

    if (customerDetails.contact1 && !/^\d{10}$/.test(customerDetails.contact1)) {
      errors.push("Contact number must be 10 digits");
    }

    if (customerDetails.pincode && !/^\d{6}$/.test(customerDetails.pincode)) {
      errors.push("Pincode must be 6 digits");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleWhatsAppOrder = () => {
    if (!validateFormBeforeSubmit()) return;

    setIsLoading(true);

    const phone = site.phone;

    const productMessages = cartItems
    .map((item, idx) => {
      const productLink = `https://footex.in/p/${item._id}`;
      const productPrice = item.price || 999;
      const extraAmount = productPrice > 999 ? productPrice - 999 : 0;
      
      let message = `*PAIR ${idx + 1}*\n`;
      message += `Product: ${item.productName.toUpperCase()}\n`;
      message += `Size: ${item.selectedSize}\n`;
      message += `Extra Amount: ₹${extraAmount}\n`;
      message += `Link: ${productLink}`;
  
      if (item.buyOneGetOne && item.freeProduct) {
        const freeProductLink = `https://footex.in/p/${item.freeProduct._id}`;
        const freeProductPrice = item.freeProduct.price || 999;
        const freeProductExtraAmount = freeProductPrice > 999 ? freeProductPrice - 999 : 0;
        
        message += `\n\n🎁 *PAIR ${idx + 2}*\n`;
        message += `Product: ${item.freeProduct.productName.toUpperCase()}\n`;
        message += `Size: ${item.freeProduct.selectedSize}\n`;
        message += `Extra Amount: ₹${freeProductExtraAmount}\n`;
        message += `Link: ${freeProductLink}`;
      }
  
      return message;
    })
    .join("\n\n");
  
    const customerMsg = `
    *2 PAIR SHOES ORDER*\n\n${productMessages}\n\n *CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n *ORDER SUMMARY*\n*Shipping Method: ${shippingMethod === "online" ? "Online" : "COD"}*\n*Shipping Charge: ₹${shippingCharge}*\n*Grand Total: ₹${totalAmount}*
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

  // Auto scroll to top when step changes
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
      <main className="container mx-auto md:px-16 px-2 md:max-w-[700px] min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
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

  const renderStepContent = () => {
    switch (currentStep) {
      case "payment":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Select Payment Method
              </CardTitle>
              <CardDescription>
                Choose how you want to pay for your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(value: "online" | "cod") => {
                  setShippingMethod(value);
                  setShippingCharge(value === "online" ? 100 : 300);
                }}
                className="space-y-3"
              >
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      shippingMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setShippingMethod(method.id);
                      setShippingCharge(method.charge);
                    }}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={method.id}
                          className="font-medium cursor-pointer"
                        >
                          {method.name}
                        </Label>
                        <div className="flex items-center gap-2">
                          {method.id === "online" && shippingMethod === "cod" && (
                            <span className="text-sm text-muted-foreground line-through">₹300</span>
                          )}
                          <Badge 
                            variant={method.id === "online" ? "default" : "secondary"}
                            className={method.id === "online" ? "bg-green-600 text-white" : ""}
                          >
                            ₹{method.charge}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                      
                      {method.id === "online" && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <Zap className="h-3 w-3" />
                            <span>Save ₹200</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Truck className="h-3 w-3" />
                            <span>Faster delivery (5-8 days)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
              
              {shippingMethod === "online" && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Great choice!</span>
                    <span>You saved ₹200 with faster delivery</span>
                  </div>
                </div>
              )}
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
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.key 
                    ? "bg-primary text-primary-foreground" 
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {steps.findIndex(s => s.key === currentStep) > index ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs mt-2">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
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
    <main className="container mx-auto md:px-16 px-2 min-h-screen pb-24">
      <div className="py-6">
        <SHeading
          title="Checkout"
          description="Complete your purchase in 2 simple steps"
          nolink
        />

        {getStepProgress()}

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Step Content */}
          <div className="space-y-6">
            {renderStepContent()}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  cartItems={cartItems}
                  shippingCharge={shippingCharge}
                  subtotal={subtotal}
                  totalAmount={totalAmount}
                  shippingMethod={shippingMethod}
                />
                
                {/* Simple Payment Method Display */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">
                      {shippingMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span className="font-medium">
                      {shippingMethod === "online" ? "5-8 days" : "10-15 days"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    By placing this order you agree to our <Link target="_blank" href="/T&C" className="underline">terms and conditions</Link>.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="container mx-auto md:px-16 md:max-w-[700px]">
          <div className="flex items-center justify-center">
            {/* Single Continue/Submit Button */}
            <Button
              onClick={handleContinue}
              disabled={
                (currentStep === "details" && (!isFormValid || isLoading)) ||
                isLoading
              }
              className="w-full max-w-md h-12 text-lg font-semibold flex items-center gap-2"
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
          </div>
          
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