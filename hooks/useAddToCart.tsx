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
  const [isSizePopupOpen, setIsSizePopupOpen] = useState(false);

  // Handle click on the product card - CLEAR PREVIOUS SELECTIONS
  const handleProductClick = (product: Product) => {
    // Clear all previous selections
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedFreeProduct(null);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  };

  // Confirm size selection for the main product
  const confirmMainProductSize = () => {
    if (!selectedSize) {
      toast("Please select a size for the main product.");
      return;
    }

    if (selectedProduct?.buyOneGetOne) {
      setIsBogoModalOpen(true);
    } else {
      addToCart(selectedProduct!, selectedSize);
      setIsSizeModalOpen(false);
      router.push("/checkout");
    }
  };

  // Add to cart function - REPLACE CART WITH SINGLE ITEM
  const addToCart = (
    item: Product,
    size: string | null,
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

    // REPLACE entire cart with just this one item (instead of adding to existing)
    const updatedCart = [cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
    toast(`${item.productName} added to cart!`);
  };

  // Filter BOGO products based on search query
  const filteredBogoProducts = (bogoProducts: Product[]) => {
    return bogoProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Render BOGO modal
  const renderBogoPage = (bogoProducts: Product[]) => {
    if (!isBogoModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-background h-full z-50 p-4 overflow-y-auto">
        {/* Minimal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Select Your 2nd Pair</h2>
          <p className="text-muted-foreground text-sm">
            Choose your second pair - get it free!
          </p>
        </div>

        {/* Selected Product Preview - Minimal */}
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

        {/* Simple Status */}
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
                    onClick={() => {
                      setSelectedFreeProduct(bogoProduct);
                      setSelectedFreeProductSize(null);
                      setIsSizePopupOpen(true);
                    }}
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

        {/* Size Selection Popup */}
        {isSizePopupOpen && selectedFreeProduct && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl border shadow-lg max-w-xs w-full p-4 animate-in fade-in-zoom-in-95">
              {/* Compact Header */}
              <div className="text-center mb-3">
                <h3 className="font-semibold text-base">Select Size</h3>
                <p className="text-xs text-muted-foreground">2nd Pair</p>
              </div>

              {/* Small Product Image */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-white rounded-lg border overflow-hidden">
                  <img
                    src={selectedFreeProduct.images[0]?.asset.url}
                    alt={selectedFreeProduct.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Compact Product Info */}
              <div className="text-center mb-3">
                <h4 className="font-medium text-sm mb-1 line-clamp-2">
                  {selectedFreeProduct.productName}
                </h4>
              </div>

              {/* Compact Size Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Size:</p>
                  {selectedFreeProductSize && (
                    <Badge variant="outline" className="text-xs">
                      {selectedFreeProductSize}
                    </Badge>
                  )}
                </div>

                {/* Compact Size Buttons */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {selectedFreeProduct.sizes.map((size: string) => (
                    <Button
                      key={size}
                      variant={
                        selectedFreeProductSize === size ? "default" : "outline"
                      }
                      size="sm"
                      className="min-w-[40px] h-8 text-xs font-normal"
                      onClick={() => setSelectedFreeProductSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-9"
                  onClick={() => {
                    setIsSizePopupOpen(false);
                    setSelectedFreeProductSize(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs h-9 font-medium"
                  disabled={!selectedFreeProductSize}
                  onClick={() => {
                    if (selectedFreeProductSize) {
                      setIsSizePopupOpen(false);
                    }
                  }}
                >
                  {selectedFreeProductSize ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Confirm
                    </div>
                  ) : (
                    "Select Size"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Fixed Bottom Bar */}
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
                      <p className="text-sm font-medium truncate">
                        Selected Shoe
                      </p>
                      <div className="flex items-center gap-2">
                        {selectedFreeProductSize ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Size: {selectedFreeProductSize}
                            </Badge>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsSizePopupOpen(true)}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  onClick={() => {
                    if (selectedFreeProduct && selectedFreeProductSize) {
                      addToCart(
                        selectedProduct!,
                        selectedSize,
                        selectedFreeProduct,
                        selectedFreeProductSize
                      );
                      setIsBogoModalOpen(false);
                      router.push("/checkout");
                    }
                  }}
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

  // Render size selection modal
  const renderSizeModal = (bogoProducts: Product[]) => (
    <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
      <DialogContent className="max-h-[70vh] rounded-xl !w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Size</DialogTitle>
        </DialogHeader>

        {/* Conditionally render ProductCard2 for the selected product */}
        {selectedFreeProduct ? (
          <>
            {/* Free Product Section */}
            <div className="flex justify-center">
              <ProductCard2 product={selectedFreeProduct} />
            </div>
            <div className="flex gap-2">
              {selectedFreeProduct.sizes.map((size: string) => (
                <Button
                  key={size}
                  variant={
                    selectedFreeProductSize === size ? "default" : "secondary"
                  }
                  onClick={() => setSelectedFreeProductSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div>
            {/* Main Product Section */}
            <div className="w-full flex my-2 justify-center mx-auto">
              <ProductCard2 product={selectedProduct} />
            </div>
            <div className="flex justify-center gap-2">
              {selectedProduct?.sizes.map((size: string) => (
                <Button
                  key={size}
                  className="w-full"
                  variant={selectedSize === size ? "default" : "secondary"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <DialogClose>
          <div>
            <Button
              size={"lg"}
              onClick={
                selectedFreeProduct
                  ? () => {
                      if (selectedFreeProductSize) {
                        addToCart(
                          selectedProduct!,
                          selectedSize,
                          selectedFreeProduct,
                          selectedFreeProductSize
                        );
                        setIsSizeModalOpen(false);
                        router.push("/checkout");
                      }
                    }
                  : confirmMainProductSize
              }
              className="w-full"
              disabled={
                !selectedSize ||
                (selectedFreeProduct && !selectedFreeProductSize)
              }
            >
              {selectedFreeProduct ? "Continue to Checkout" : "Confirm Size"}
            </Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  return {
    handleProductClick,
    renderBogoPage,
    renderSizeModal,
  };
};