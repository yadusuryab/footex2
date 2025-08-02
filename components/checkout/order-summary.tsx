import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/orderUtils";

interface OrderSummaryProps {
  cartItems: CartItem[];
  shippingCharge: number;
  subtotal: number;
  totalAmount: number;
}

export const OrderSummary = ({
  cartItems,
  shippingCharge,
  subtotal,
  totalAmount,
}: OrderSummaryProps) => (
  <div className="space-y-4">
    {cartItems.map((item) => (
      <div key={item._id} className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{item.productName}</h3>
          <p className="text-sm text-muted-foreground">{item.shoeBrand}</p>
          {item.selectedSize && (
            <p className="text-sm text-muted-foreground">
              Size: {item.selectedSize}
            </p>
          )}
        </div>
        <p className="font-medium">₹{item.offerPrice || item.price}</p>
      </div>
    ))}
    <Separator />
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Shipping Charges</span>
        <span>₹{shippingCharge}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Platform Fee</span>
        <span>₹{(totalAmount - subtotal - shippingCharge).toFixed(2)}</span>
      </div>
    </div>
    <Separator />
    <div className="flex items-center justify-between font-medium">
      <span>Total</span>
      <span>₹{totalAmount.toFixed(2)}</span>
    </div>
  </div>
);
