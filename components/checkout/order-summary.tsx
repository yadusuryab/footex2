import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/lib/orderUtils";
import { Truck, Shield, Tag, Package, Gift } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items ({totalItems})
        </h3>
        
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item, index) => (
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
                      <p className="font-semibold text-sm ml-2">
                        ₹{item.offerPrice || item.price}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {item.selectedSize && (
                          <span>Size: {item.selectedSize}</span>
                        )}
                      </div>
                      
                      {/* BOGO Badge */}
                      {item.buyOneGetOne && (
                        <Badge variant="secondary" className="text-xs">
                          BOGO
                        </Badge>
                      )}
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
                          <Gift className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                      {/* Free Badge */}
                      <div className="absolute -top-1 -right-1">
                        <Badge className="bg-green-600 text-white text-xs px-1 py-0 h-4">
                          FREE
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Free Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Gift className="h-3 w-3 text-green-600" />
                            <h4 className="font-medium text-sm line-clamp-2 text-green-800">
                              {item.freeProduct.productName}
                            </h4>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            {item.freeProduct.shoeBrand || 'Free Product'}
                          </p>
                        </div>
                        <p className="font-semibold text-sm ml-2 text-green-600">
                          ₹0
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-green-600">
                          {item.freeProduct.selectedSize && (
                            <span>Size: {item.freeProduct.selectedSize}</span>
                          )}
                        </div>
                        
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                          COMPLIMENTARY
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}
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
            <span className="text-muted-foreground">Subtotal ({cartItems.length} paid items)</span>
            <span>₹{subtotal}</span>
          </div>

          {/* Free Items Summary */}
          {isBOGO && (
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-2">
                <Gift className="h-3 w-3" />
                Free Items ({totalItems - cartItems.length} products)
              </span>
              <span className="font-medium">-₹{calculateFreeProductsValue(cartItems)}</span>
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
          
          {platformFee > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Platform Fee</span>
              </div>
              <span>₹{platformFee.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total Amount</span>
          <span className="text-lg">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        {/* Savings Summary */}
        {isBOGO && (
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                <Tag className="h-4 w-4" />
                <span>You're saving with Buy One Get One!</span>
              </div>
              <div className="text-xs text-blue-600">
                <p>• Got {totalItems - cartItems.length} free product(s)</p>
                <p>• Total savings: ₹{calculateFreeProductsValue(cartItems)}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Delivery Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-3 w-3" />
          <span>Estimated delivery: 4-7 business days</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate total value of free products
function calculateFreeProductsValue(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    if (item.buyOneGetOne && item.freeProduct) {
      return total + (item.freeProduct.price || item.price || 0);
    }
    return total;
  }, 0);
}