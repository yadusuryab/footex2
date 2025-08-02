// components/CartItem.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CartItemProps {
  item: {
    _id: string;
    productName: string;
    shoeBrand: string;
    images: { asset: { url: string } }[];
    offerPrice?: number;
    price: number;
    selectedSize?: number;
    freeProduct?: {
      _id: string;
      productName: string;
      shoeBrand: string;
      images: { asset: { url: string } }[];
      selectedSize?: number;
    } | null;
  };
  onRemove?: any; // Callback for removing the item
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div key={item._id}>
      {/* Main Product */}
      <div
        className={`flex items-center w-full gap-4 ${
          !item.freeProduct
            ? "rounded-3xl "
            : "rounded-t-3xl  border-b-0"
        } bg-white p-4  dark:border-gray-700 dark:bg-gray-950`}
      >
        <div className="relative w-20 h-20 rounded-md overflow-hidden">
          {item.images && (
          <Link href={`/p/${item._id}`}>    <Image
              src={item.images[0]?.asset.url || "/placeholder.svg"}
              alt={item.productName}
              fill
              className="object-cover"
            /> </Link>
          )}
        </div>
        <div className="flex-1">
          <Link href={`/p/${item._id}`}><h3 className="text-lg font-medium">{item.productName}</h3></Link>
          <p className="text-gray-500 dark:text-gray-400">{item.shoeBrand}</p>
          {item.selectedSize && (
            <p className="text-sm text-muted-foreground">
              Size: {item.selectedSize}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRemove && (
            <Button variant="secondary" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-right font-bold">
          ₹{item.offerPrice || item.price}
        </div>
      </div>

      {/* Free Product */}
      {item.freeProduct && (
        <div className="flex relative items-center gap-4 rounded-b-3xl border-2  border-dotted p-4 shadow-lg">
          <div className="relative w-20 h-20 rounded-md overflow-hidden">
          <Link href={`/p/${item.freeProduct._id}`}>  <Image
              src={item.freeProduct.images[0]?.asset.url || "/placeholder.svg"}
              alt={item.freeProduct.productName}
              fill
              className="object-cover"
            /> </Link>
          </div>
          <div className="absolute -top-0 -right-0">
            <Badge className="rounded-none rounded-l-xl shadow-sm " variant={'secondary'}>Free Product</Badge>
          </div>
          <div className="flex-1">
          <Link href={`/p/${item.freeProduct._id}`}>  <h3 className="text-lg font-medium">
              {item.freeProduct.productName}
            </h3></Link>
            <p className="text-gray-500">{item.freeProduct.shoeBrand}</p>
            {item.freeProduct.selectedSize && (
              <p className="text-sm text-muted-foreground">
                Size: {item.freeProduct.selectedSize}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
