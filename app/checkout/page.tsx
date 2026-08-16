"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingBag, CheckCircle2, Zap, Truck, ArrowRight, Gift, Star, Shield, Flame, SprayCan } from "lucide-react";
import Image from "next/image";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import Link from "next/link";

interface CartItem {
  _id: string;
  productName: string;
  selectedSize: string;
  price: number;
  image?: string;
  imageUrl?: string;
  images?: Array<{ asset: { url: string } }>;
  buyOneGetOne?: boolean;
  freeProduct?: CartItem;
}

type CheckoutStep = "payment" | "details";

const getProductImageUrl = (product: any): string => {
  if (!product) return "/placeholder-image.jpg";
  let url = product.image || product.imageUrl || product.images?.[0]?.asset?.url || product.images?.[0]?.url || "";
  if (!url) return "/placeholder-image.jpg";
  if (url.includes("cloudinary.com")) return url.replace("/upload/", "/upload/w_200,h_200,q_50,f_auto/");
  return url;
};

const BASE_PRICE = 1499;
const COD_CHARGE = 300;
const SHOE_CLEANER_PRICE = 80;

// Delivery windows (business days added on top of order date)
const ONLINE_DELIVERY_MIN_DAYS = 5;
const ONLINE_DELIVERY_MAX_DAYS = 8;
const COD_DELIVERY_MIN_DAYS = 7;
const COD_DELIVERY_MAX_DAYS = 10;

// Formats a single date like "Mon, 6 Jul"
const formatDeliveryDate = (date: Date): string =>
  date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

// Returns an object with the earliest/latest expected delivery dates and a display string
const getExpectedDelivery = (minDays: number, maxDays: number, from: Date = new Date()) => {
  const start = new Date(from);
  start.setDate(start.getDate() + minDays);
  const end = new Date(from);
  end.setDate(end.getDate() + maxDays);
  return {
    start,
    end,
    label: `${formatDeliveryDate(start)} - ${formatDeliveryDate(end)}`,
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">("online");
  const [addShoeCleaner, setAddShoeCleaner] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [customerDetails, setCustomerDetails] = useState({
    name: "", contact1: "", contact2: "", address: "",
    district: "", state: "", pincode: "", landmark: "", instagramId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [orderDate] = useState<Date>(() => new Date());

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch { setCartItems([]); }
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentStep]);

  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;
  const pair1Extra = Math.max(0, (mainProduct?.price || BASE_PRICE) - BASE_PRICE);
  const pair2Extra = Math.max(0, (freeProduct?.price || BASE_PRICE) - BASE_PRICE);
  const subtotal = BASE_PRICE + pair1Extra + pair2Extra;
  const shippingCharge = shippingMethod === "online" ? 0 : COD_CHARGE;
  const cleanerCharge = addShoeCleaner ? SHOE_CLEANER_PRICE : 0;
  const totalAmount = subtotal + shippingCharge + cleanerCharge;

  const onlineDelivery = getExpectedDelivery(ONLINE_DELIVERY_MIN_DAYS, ONLINE_DELIVERY_MAX_DAYS, orderDate);
  const codDelivery = getExpectedDelivery(COD_DELIVERY_MIN_DAYS, COD_DELIVERY_MAX_DAYS, orderDate);
  const activeDelivery = shippingMethod === "online" ? onlineDelivery : codDelivery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleWhatsAppOrder = () => {

    setIsLoading(true);
    try {
      const productMessages = cartItems.map((item, idx) => {
        const extra = Math.max(0, (item.price || BASE_PRICE) - BASE_PRICE);
        let msg = `*PAIR ${idx + 1}*\nProduct: ${item.productName?.toUpperCase() || "Unknown"}\nSize: ${item.selectedSize || "N/A"}\nExtra: ₹${extra}\nLink: https://footex.in/p/${item._id}`;
        if (item.buyOneGetOne && item.freeProduct) {
          const fExtra = Math.max(0, (item.freeProduct.price || BASE_PRICE) - BASE_PRICE);
          msg += `\n\n*PAIR ${idx + 2}*\nProduct: ${item.freeProduct.productName?.toUpperCase() || "Unknown"}\nSize: ${item.freeProduct.selectedSize || "N/A"}\nExtra: ₹${fExtra}\nLink: https://footex.in/p/${item.freeProduct._id}`;
        }
        return msg;
      }).join("\n\n");

      const msg = `*2 PAIR SHOES ORDER*\n\n${productMessages}\n\n*CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n*ORDER SUMMARY*\nBase Price: ₹${BASE_PRICE}\n${addShoeCleaner ? `Add-on: Shoe Cleaner Kit (+₹${SHOE_CLEANER_PRICE})\n` : ""}Shipping: ${shippingMethod === "online" ? "FREE (Online Payment)" : `₹${COD_CHARGE} (Cash on Delivery)`}\nExpected Delivery: ${activeDelivery.label}\n*GRAND TOTAL: ₹${totalAmount}*`.trim();

      setTimeout(() => {
        window.open(`https://wa.me/${site.phone}?text=${encodeURIComponent(msg)}`, "_blank");
        localStorage.removeItem("cart");
        setIsLoading(false);
      }, 500);
    } catch {
      setIsLoading(false);
      setFormErrors(["Failed to create order. Please try again."]);
    }
  };

  const ProductImage = ({ product, alt, borderClass }: { product: any; alt: string; borderClass: string }) => (
    <div className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 ${borderClass}`}>
      <Image src={getProductImageUrl(product)} alt={alt} width={200} height={200} quality={50}
        className="w-full h-full object-cover" loading="eager" />
    </div>
  );

  const StepProgress = () => (
    <div className="flex items-center justify-center mb-6">
      {(["payment", "details"] as CheckoutStep[]).map((step, i) => {
        const labels = ["Payment", "Details"];
        const activeIdx = ["payment", "details"].indexOf(currentStep);
        const isDone = activeIdx > i;
        const isActive = currentStep === step;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs mt-1">{labels[i]}</span>
            </div>
            {i < 1 && <div className={`w-12 h-1 mx-1 transition-colors ${isDone || isActive ? "bg-green-500" : "bg-muted"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  if (!cartItems.length || !mainProduct) {
    return (
      <main className="container mx-auto px-4 max-w-md min-h-screen flex items-center justify-center">
        <Card className="w-full text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">{!cartItems.length ? "Your cart is empty" : "Invalid Cart"}</h2>
            <p className="text-muted-foreground mb-6">{!cartItems.length ? "Add some stylish shoes to get started!" : "Your cart contains invalid items."}</p>
            <Button onClick={() => { localStorage.removeItem("cart"); router.push("/"); }} className="w-full">
              {!cartItems.length ? "Continue Shopping" : "Start Over"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 max-w-2xl min-h-screen pb-24">
      <div className="py-4">
        <StepProgress />

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">{formErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </AlertDescription>
          </Alert>
        )}

        {currentStep === "payment" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Product Pairs */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Your Selected Pairs 🔥</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <ProductImage product={mainProduct} alt={mainProduct.productName || "Main Product"} borderClass="border-blue-500" />
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{mainProduct.productName || "Product"}</p>
                      <p className="text-xs text-muted-foreground">Size: {mainProduct.selectedSize || "N/A"}</p>
                      <Badge variant="default" className="mt-1">1st Pair</Badge>
                    </div>
                  </div>
                  {freeProduct && (
                    <div className="flex-1">
                      <div className="relative">
                        <ProductImage product={freeProduct} alt={freeProduct.productName || "Free Product"} borderClass="border-green-500" />
                      
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">{freeProduct.productName || "Free Product"}</p>
                        <p className="text-xs text-muted-foreground">Size: {freeProduct.selectedSize || "N/A"}</p>
                        <Badge className="mt-1 bg-green-600 text-white">2nd Pair</Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Free flame socks callout */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 px-3 py-2 shadow-sm">
                  <Flame className="h-4 w-4 text-white shrink-0" />
                  <p className="text-xs font-bold text-white">
                      Offer: Free Flame Socks with this order 🎉
                  </p>
                </div>
              </div>

              {/* Payment Options */}
             <RadioGroup
  value={shippingMethod}
  onValueChange={(v: "online" | "cod") => setShippingMethod(v)}
  className="space-y-3"
>
  {/* Online Payment */}
  <div
    className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
      shippingMethod === "online"
        ? "border-red-500 bg-red-50"
        : "border-muted hover:border-primary/50"
    }`}
    onClick={() => setShippingMethod("online")}
  >
    <RadioGroupItem value="online" id="online" className="mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Label htmlFor="online" className="font-semibold cursor-pointer">
          Online Payment
        </Label>
        <Badge className="bg-green-700 text-green-50 text-xs px-2 py-0.5 rounded-full">
          Free shipping
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
          <Zap className="h-3 w-3" /> Save ₹{COD_CHARGE} instantly
        </span>
        <span className="flex items-center gap-1 text-xs text-blue-600">
          <Truck className="h-3 w-3" /> Arrives {onlineDelivery.label}
        </span>
      </div>
    </div>
  </div>

  {/* COD */}
  <div
    className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
      shippingMethod === "cod"
        ? "border-orange-400 bg-orange-50"
        : "border-muted hover:border-primary/50"
    }`}
    onClick={() => setShippingMethod("cod")}
  >
    <RadioGroupItem value="cod" id="cod" className="mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Label htmlFor="cod" className="font-semibold cursor-pointer">
          Cash on Delivery
        </Label>
        <Badge className="text-orange-800 border-orange-200 bg-orange-100 text-xs px-2 py-0.5 rounded-full">
          +₹{COD_CHARGE} extra
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        Pay when you receive · Arrives {codDelivery.label}
      </p>
    </div>
  </div>
</RadioGroup>

              {/* Shoe Cleaner Add-on - Offer style */}
              <div
                onClick={() => setAddShoeCleaner(!addShoeCleaner)}
                className={`relative mt-4 cursor-pointer rounded-xl p-[2px] transition-all ${
                  addShoeCleaner
                    ? "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"
                    : "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 animate-pulse"
                }`}
              >
                {/* Corner ribbon */}
                <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-0.5 shadow-md">
                  <Star className="h-3 w-3 text-yellow-900 fill-yellow-900" />
                  <span className="text-[10px] font-extrabold text-yellow-900 tracking-wide">LIMITED OFFER</span>
                </div>

                <div className={`flex items-start gap-3 rounded-[10px] p-4 pt-5 ${addShoeCleaner ? "bg-blue-50" : "bg-white"}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${addShoeCleaner ? "bg-blue-600" : "bg-gradient-to-br from-purple-600 to-cyan-500"}`}>
                    <SprayCan className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Label className="font-bold cursor-pointer text-sm">
                        Add Premium Shoe Cleaner Kit
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground line-through">₹199</span>
                        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          ₹{SHOE_CLEANER_PRICE} only
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep both pairs looking fresh · Most customers add this 🔥
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={addShoeCleaner}
                        onChange={() => setAddShoeCleaner(!addShoeCleaner)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span className={`text-xs font-semibold ${addShoeCleaner ? "text-blue-600" : "text-muted-foreground"}`}>
                        {addShoeCleaner ? "✓ Added to your order" : "Tap to add"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentStep("details")} className="w-full h-12 text-lg font-semibold mt-6 flex items-center gap-2" size="lg">
                Continue to Details <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Delivery Information
              </CardTitle>
              <CardDescription>Enter your details for order delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerDetailsForm customerDetails={customerDetails} handleInputChange={handleInputChange} />
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span>Base Price (2 Pairs)</span><span>₹{BASE_PRICE}</span></div>
              {pair1Extra > 0 && <div className="flex justify-between text-sm text-muted-foreground ml-4"><span>Extra – Pair 1</span><span>+₹{pair1Extra}</span></div>}
              {pair2Extra > 0 && <div className="flex justify-between text-sm text-muted-foreground ml-4"><span>Extra – Pair 2</span><span>+₹{pair2Extra}</span></div>}
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" /> Flame Socks</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              {addShoeCleaner && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1"><SprayCan className="h-3.5 w-3.5 text-blue-500" /> Shoe Cleaner Kit</span>
                  <span>+₹{SHOE_CLEANER_PRICE}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                {shippingMethod === "online"
                  ? <span className="text-green-600 font-semibold">🎁 FREE SHIPPING</span>
                  : <span>₹{COD_CHARGE}</span>}
              </div>
          <div className="rounded-2xl bg-muted/60 px-6 py-6 flex flex-col items-center text-center gap-2">
                <Truck className="h-8 w-8 text-foreground/80" strokeWidth={1.5} />
                <p className="text-xs font-medium text-foreground">
                  Expected Delivery by {formatDeliveryDate(activeDelivery.end)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Delivery Time : {shippingMethod === "online"
                    ? `${ONLINE_DELIVERY_MIN_DAYS} - ${ONLINE_DELIVERY_MAX_DAYS}`
                    : `${COD_DELIVERY_MIN_DAYS} - ${COD_DELIVERY_MAX_DAYS}`} Working Days
                </p>
              </div>
 
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total Amount</span><span>₹{totalAmount}</span>
              </div>
              {shippingMethod === "cod" && (
                <p className="text-xs text-orange-600 text-center">💡 Switch to Online Payment to save ₹{COD_CHARGE}!</p>
              )}
              <div className="border-t pt-3 text-xs text-muted-foreground">
                By placing this order, you agree to the <Link href="/T&C" className="text-primary hover:underline">Terms and Conditions</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating free socks badge - festive */}
      <div className="fixed bottom-24 right-4 z-40 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white text-xs font-bold px-3 py-2 shadow-lg ring-2 ring-yellow-300 animate-bounce">
        <Flame className="h-3.5 w-3.5" />
        Free Socks 🎉
      </div>

      {/* Fixed Bottom CTA */}
      {currentStep === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button onClick={handleWhatsAppOrder} disabled={isLoading} className="w-full h-12 text-lg font-semibold flex items-center gap-2" size="lg">
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Order...</> : `Order via WhatsApp – ₹${totalAmount}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">You'll be redirected to WhatsApp to confirm • Estimated delivery {activeDelivery.label}</p>
          </div>
        </div>
      )}
    </main>
  );
}