import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/lib/orderUtils";
import { Truck, Shield, Tag, Package, Gift, Zap } from "lucide-react";

interface OrderSummaryProps {
  cartItems: CartItem[];
  shippingCharge: number;
  subtotal: number;
  totalAmount: number;
  shippingMethod?: "online" | "cod";
}

export const OrderSummary = ({
  cartItems,
  shippingCharge,
  subtotal,
  totalAmount,
  shippingMethod = "online",
}: OrderSummaryProps) => {
  const platformFee = totalAmount - subtotal - shippingCharge;
  const isBOGO = cartItems.some(item => item.buyOneGetOne);

  // Calculate total items including free products
  const totalItems = cartItems.reduce((total, item) => {
    return total + (item.buyOneGetOne && item.freeProduct ? 2 : 1);
  }, 0);

  // Calculate total extra amount
  const totalExtraAmount = calculateTotalExtraAmount(cartItems);

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items ({totalItems})
        </h3>
        
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item, index) => {
            const productPrice = item.offerPrice || item.price || 999;
            const extraAmount = productPrice > 999 ? productPrice - 999 : 0;
            const freeProductExtraAmount = item.buyOneGetOne && item.freeProduct 
              ? (item.freeProduct.price || 999) > 999 ? (item.freeProduct.price || 999) - 999 : 0
              : 0;

            return (
              <div key={item._id} className="space-y-3">
                {/* Main Product */}
                <Card className="p-3">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg border bg-muted overflow-hidden">
                      {item.images[0]?.asset.url ? (
                        <img 
                          src={item.images[0]?.asset.url} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.shoeBrand}
                          </p>
                        </div>
                        {/* <div className="text-right ml-2">
                          <p className="font-semibold text-sm">
                            ₹{productPrice}
                          </p>
                          {extraAmount > 0 && (
                            <p className="text-xs text-orange-600">
                              +₹{extraAmount} extra
                            </p>
                          )}
                        </div> */}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>
                        
                        {/* BOGO Badge */}
                        {/* {item.buyOneGetOne && (
                          <Badge variant="secondary" className="text-xs">
                            BOGO
                          </Badge>
                        )} */}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Free Product in BOGO */}
                {item.buyOneGetOne && item.freeProduct && (
                  <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ml-4">
                    <div className="flex gap-3">
                      {/* Free Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg border bg-green-100 overflow-hidden relative">
                        {item.freeProduct.images[0]?.asset.url ? (
                          <img 
                            src={item.freeProduct.images[0]?.asset.url} 
                            alt={item.freeProduct.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-green-100">
                            {/* <Gift className="h-6 w-6 text-green-600" /> */}
                          </div>
                        )}
                        {/* Free Badge */}
                        {/* <div className="absolute -top-1 -right-1">
                          <Badge className="bg-green-600 text-white text-xs px-1 py-0 h-4">
                            FREE
                          </Badge>
                        </div> */}
                      </div>
                      
                      {/* Free Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {/* <Gift className="h-3 w-3 text-green-600" /> */}
                              <h4 className="font-medium text-sm line-clamp-2 text-green-800">
                                {item.freeProduct.productName}
                              </h4>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              {item.freeProduct.shoeBrand || '2nd Pair'}
                            </p>
                          </div>
                          {/* <div className="text-right ml-2">
                            <p className="font-semibold text-sm text-green-600">
                              ₹0
                            </p>
                            {freeProductExtraAmount > 0 && (
                              <p className="text-xs text-orange-600">
                                +₹{freeProductExtraAmount} extra
                              </p>
                            )}
                          </div> */}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 text-xs text-green-600">
                            {item.freeProduct.selectedSize && (
                              <span>Size: {item.freeProduct.selectedSize}</span>
                            )}
                          </div>
                      
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Pricing Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Price Breakdown
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Base Price ({cartItems.length} items)</span>
            <span>₹{cartItems.length * 999}</span>
          </div>

          {/* Extra Amounts */}
          {totalExtraAmount > 0 && (
            <div className="flex items-center justify-between text-orange-600">
              <span className="text-muted-foreground">Extra Amounts (selected Products)</span>
              <span className="font-medium">+₹{totalExtraAmount}</span>
            </div>
          )}

          {/* Free Items Summary */}
          {isBOGO && (
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-2">
                <Gift className="h-3 w-3" />
                Free Items ({totalItems - cartItems.length} products)
              </span>
              <span className="font-medium">-₹{calculateFreeProductsBaseValue(cartItems)}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>
                Shipping ({shippingMethod === "online" ? "Online Delivery" : "Cash on Delivery"})
              </span>
            </div>
            <span>₹{shippingCharge}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total Amount</span>
          <span className="text-lg">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        {/* Prepaid Offer Banner */}
       

        {/* Extra Amounts Summary */}
        {totalExtraAmount > 0 && (
          <Card className="p-3 bg-orange-50 border-orange-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-orange-700 font-medium">
                <Tag className="h-4 w-4" />
                <span>selected Product Charges</span>
              </div>
              <div className="text-xs text-orange-600">
                <p>• Extra charges applied for selected products above ₹999</p>
                <p>• Total extra amount: ₹{totalExtraAmount}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Delivery Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-3 w-3" />
          <span>
            Estimated delivery: {shippingMethod === 'online' ? '5-8 days' : '10-15 working days'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate total value of free products (base value only)
function calculateFreeProductsBaseValue(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    if (item.buyOneGetOne && item.freeProduct) {
      return total + 999; // Only base value, not including extras
    }
    return total;
  }, 0);
}

// Helper function to calculate total extra amount from all products
function calculateTotalExtraAmount(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    // Main product extra amount
    const productPrice = item.offerPrice || item.price || 999;
    const extraAmount = productPrice > 999 ? productPrice - 999 : 0;
    
    let totalExtra = extraAmount;

    // Free product extra amount
    if (item.buyOneGetOne && item.freeProduct) {
      const freeProductPrice = item.freeProduct.price || 999;
      const freeProductExtraAmount = freeProductPrice > 999 ? freeProductPrice - 999 : 0;
      totalExtra += freeProductExtraAmount;
    }

    return total + totalExtra;
  }, 0);
}