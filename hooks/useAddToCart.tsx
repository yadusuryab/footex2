"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard2 from "@/components/product/product-image-card";
import { DialogClose } from "@radix-ui/react-dialog";
import { Search, CheckCircle, ArrowRightCircle, Ruler } from "lucide-react";
import SHeading from "@/components/utils/section-heading";
import { IconSquareRoundedCheckFilled } from "@tabler/icons-react";

export interface Product {
  _id: string;
  productName: string;
  sizes: string[];
  buyOneGetOne: boolean;
  images: { asset: { url: string } }[];
  name?: string;
}

export const useAddToCart = () => {
  const router = useRouter();
  const [isBogoModalOpen, setIsBogoModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | any>(null);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<Product | any>(null);
  const [selectedSize, setSelectedSize] = useState<string | any>(null);
  const [selectedFreeProductSize, setSelectedFreeProductSize] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle click on the product card
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedFreeProduct(null);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  };

  // Add to cart function
  const addToCart = (
    item: Product,
    size: string,
    freeProduct?: Product | null,
    freeProductSize?: string | null
  ) => {
    const cartItem = {
      ...item,
      selectedSize: size,
      freeProduct: freeProduct
        ? { ...freeProduct, selectedSize: freeProductSize }
        : null,
    };

    const updatedCart = [cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast(`${item.productName} added to cart!`);
  };

  // Filter BOGO products
  const filteredBogoProducts = (bogoProducts: Product[]) => {
    return bogoProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle free product selection - opens size modal
  const handleFreeProductSelect = (bogoProduct: Product) => {
    setSelectedFreeProduct(bogoProduct);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  };

  // Complete BOGO flow - UPDATED
  const completeBogoFlow = () => {
    if (selectedFreeProduct && selectedFreeProductSize) {
      addToCart(
        selectedProduct!,
        selectedSize,
        selectedFreeProduct,
        selectedFreeProductSize
      );
      setIsBogoModalOpen(false);
      setIsSizeModalOpen(false); // Close any open modals
      router.push("/checkout"); // Redirect to checkout
    }
  };

  // Render BOGO modal
  const renderBogoPage = (bogoProducts: Product[]) => {
    if (!isBogoModalOpen) return null;

    return (
      <div className="fixed inset-0 mt-2 bg-background h-full z-50 p-4 overflow-y-auto">
        <SHeading title="Select 2nd Pair" nolink />

        {/* Selected Product Preview */}
        {selectedProduct && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 bg-white rounded border overflow-hidden">
              <img
                src={selectedProduct.images[0]?.asset.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Your first pair</p>
              <p className="text-xs text-muted-foreground">
                Size: {selectedSize}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              ✓ Selected
            </Badge>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {filteredBogoProducts(bogoProducts).length} pairs available
          </span>
          {selectedFreeProduct && !selectedFreeProductSize && (
            <div className="flex items-center gap-1 text-amber-600 text-sm">
              <Ruler className="h-4 w-4" />
              <span>Select size for 2nd pair</span>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4 mb-20">
          {filteredBogoProducts(bogoProducts).length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">No products found</p>
            </div>
          ) : (
            filteredBogoProducts(bogoProducts).map((bogoProduct) => (
              <div key={bogoProduct._id} className="w-full">
                <div
                  className={`relative rounded-lg border transition-colors ${
                    selectedFreeProduct?._id === bogoProduct._id
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <ProductCard2
                    ybg={false}
                    product={bogoProduct}
                    className="w-full"
                    onClick={() => handleFreeProductSelect(bogoProduct)}
                  />

                  {selectedFreeProduct?._id === bogoProduct._id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Selection Status */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {selectedFreeProduct ? (
                  <>
                    <div className="w-10 h-10 bg-white rounded border overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={selectedFreeProduct.images[0]?.asset.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {selectedFreeProductSize ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Size {selectedFreeProductSize}
                            </Badge>
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Ready for checkout
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleFreeProductSelect(selectedFreeProduct)}
                            className="text-xs text-amber-600 underline hover:no-underline font-medium"
                          >
                            ← Select size for 2nd pair
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select your 2nd pair (Free)
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  onClick={completeBogoFlow}
                  disabled={!selectedFreeProduct || !selectedFreeProductSize}
                  className="min-w-[140px] h-11 font-medium"
                >
                  {selectedFreeProductSize ? (
                    <div className="flex items-center gap-2">
                      Continue to Checkout
                      <ArrowRightCircle className="h-4 w-4" />
                    </div>
                  ) : (
                    "Select Size First"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Unified size modal for both main product and free product
  const renderSizeModal = (bogoProducts: Product[]) => {
    const isSelectingFreeProduct = !!selectedFreeProduct;
    const currentProduct = isSelectingFreeProduct ? selectedFreeProduct : selectedProduct;
    const currentSize = isSelectingFreeProduct ? selectedFreeProductSize : selectedSize;
    const setCurrentSize = isSelectingFreeProduct ? setSelectedFreeProductSize : setSelectedSize;

    return (
      <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
        <DialogContent className="max-h-[90vh] p-2 rounded-3xl w-full max-w-[300px]">
         

          {/* Product Display */}
          <div className="flex justify-center">
            <ProductCard2 product={currentProduct!} />
          </div>

          {/* Size Selection */}
          <div className="flex flex-wrap justify-center gap-2">
            {currentProduct?.sizes.map((size: string) => (
              <Button
                key={size}
                className="min-w-[60px]"
                variant={currentSize === size ? "default" : "outline"}
                onClick={() => setCurrentSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>

          {/* Confirm Button */}
          <DialogClose asChild>
            <Button
              size="lg"
              onClick={() => {
                if (currentSize) {
                  if (isSelectingFreeProduct) {
                    // Free product size selected - just close modal
                    setIsSizeModalOpen(false);
                    // After selecting free product size, automatically proceed to checkout
                    completeBogoFlow(); // This will add to cart and redirect
                  } else {
                    // Main product size selected
                    if (selectedProduct?.buyOneGetOne) {
                      setIsBogoModalOpen(true);
                      setIsSizeModalOpen(false);
                    } else {
                      addToCart(selectedProduct!, currentSize);
                      setIsSizeModalOpen(false);
                      router.push("/checkout");
                    }
                  }
                }
              }}
              className="w-full"
              disabled={!currentSize}
            >
              {isSelectingFreeProduct ? "Confirm & Checkout" : "Confirm Size"} 
              <IconSquareRoundedCheckFilled />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    handleProductClick,
    renderBogoPage,
    renderSizeModal,
  };
};