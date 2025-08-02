"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import SHeading from "@/components/utils/section-heading";
import {
  calculateSubtotal,
  calculateTotalAmount,
  CartItem,
  validateForm,
} from "@/lib/orderUtils";
import { handleCheckout } from "@/lib/checkoutUtils";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { client } from "@/sanityClient";
import { site } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");
  const [shippingCharge, setShippingCharge] = useState(
    paymentMethod === "upi" ? 100 : 300
  );
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    contact1: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const subtotal = calculateSubtotal(cartItems);
  const totalAmount = calculateTotalAmount(subtotal, shippingCharge);

  const handlePaymentChange = (method: "upi" | "cod") => {
    setPaymentMethod(method);
    setShippingCharge(method === "upi" ? 100 : 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };
  const handleWhatsAppOrder = () => {
    const phone = '919495314108'; // fallback if not defined
    const productMessages = cartItems
      .map(
        (item, idx) => `
  ${idx + 1}. ${item.productName} - Size: ${item.selectedSize}
  Link: https://footex2.vercel.app/p/${item._id}
  ${item.buyOneGetOne && item.freeProduct
          ? `+ FREE: ${item.freeProduct.productName} - Size: ${item.freeProductSize}
  Link: https://footex2.vercel.app/p/${item.freeProduct._id}`
          : ""
        }
      `.trim()
      )
      .join("\n\n");
  
    const customerMsg = `
  🛍️ *New Order via Website*
  
  👤 Name: ${customerDetails.name}
  📧 Email: ${customerDetails.email}
  📞 Contact: ${customerDetails.contact1}
  🏠 Address: ${customerDetails.address}, ${customerDetails.district}, ${customerDetails.state} - ${customerDetails.pincode}
  
  📦 *Order Details*:
  ${productMessages}
  
  💰 Total: ₹${totalAmount}
  🚚 Shipping: ₹${shippingCharge}
  💳 Payment Mode: ${paymentMethod.toUpperCase()}
  `.trim();
  
    const encodedMsg = encodeURIComponent(customerMsg);
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
  };
  
  const onCheckout = async (transactionId: any) => {
    if (!validateForm(customerDetails, cartItems)) return;
    await handleCheckout(
      customerDetails,

      cartItems,
      totalAmount,
      shippingCharge,
      router,
      transactionId,
      setIsLoading,
      paymentMethod,
     
    );
  };
  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto md:px-16 px-2 md:max-w-[700px]">
        <SHeading
          title="Checkout"
          description="Your cart is empty. Please add items to proceed."
          nolink
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto md:px-16 px-2 md:max-w-[700px]">
      <SHeading
        title="Checkout"
        description="Verify all the information before checkout."
        nolink
      />
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerDetailsForm
              customerDetails={customerDetails}
              handleInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary
              cartItems={cartItems}
              shippingCharge={shippingCharge}
              subtotal={subtotal}
              totalAmount={totalAmount}
            />
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethod
              paymentMethod={paymentMethod}
              handlePaymentChange={handlePaymentChange}
              handleCheckout={onCheckout}
              isLoading={isLoading}
              totalAmount={totalAmount}
            />
          </CardContent>
        </Card> */}
        <div className="w-full p-4 fixed bottom-0 bg-primary/50 z-[100] left-0 backdrop-blur-2xl">
  <Button
    onClick={handleWhatsAppOrder}
    disabled={!customerDetails.name || !customerDetails.contact1 || !customerDetails.address || !customerDetails.pincode}
    className="w-full"
    variant={'secondary'}
    size={'lg'}
  >
    Order via WhatsApp
  </Button>
</div>

      </div>
    </main>
  );
}
