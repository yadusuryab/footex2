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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Import Input component for search bar
import ProductCard2 from "@/components/product/product-image-card";
import { DialogClose } from "@radix-ui/react-dialog";
import { 
  Search, CheckCircle, ShoppingCart, AlertCircle, ChevronRight, 
  Ruler, Gift, Lock, AlertTriangle, Plus, MousePointerClick, 
  RotateCcw, ArrowDown, 
  X
} from "lucide-react";

import Image from "next/image";
import { motion } from "framer-motion";

export interface Product {
  _id: string;
  productName: string;
  sizes: string[];
  buyOneGetOne: boolean;
}

export const useAddToCart = () => {
  const router = useRouter();
  const [isBogoModalOpen, setIsBogoModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | any>(null);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<Product | any>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<string | any>(null);
  const [selectedFreeProductSize, setSelectedFreeProductSize] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search bar
  const [isSizePopupOpen, setIsSizePopupOpen] = useState(false);
  // Handle click on the product card
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsSizeModalOpen(true); // Open size selection modal first
  };

  // Confirm size selection for the main product
  const confirmMainProductSize = () => {
    if (!selectedSize) {
      toast("Please select a size for the main product.");
      return;
    }

    if (selectedProduct?.buyOneGetOne) {
      setIsBogoModalOpen(true); // Open BOGO modal after size selection
    } else {
      addToCart(selectedProduct!, selectedSize);
      setIsSizeModalOpen(false);
      router.push("/my-cart");
    }
  };

  // Confirm BOGO selection
  const confirmBogoSelection = () => {
    if (!selectedFreeProduct) {
      toast("Please select a free product.");
      return;
    }

    setIsBogoModalOpen(false);
    setIsSizeModalOpen(true); // Open size selection modal for the free product
  };

  // Confirm size selection for the free product
  const confirmFreeProductSize = () => {
    if (!selectedFreeProductSize) {
      toast("Please select a size for the free product.");
      return;
    }

    addToCart(
      selectedProduct!,
      selectedSize,
      selectedFreeProduct,
      selectedFreeProductSize
    );
    setIsSizeModalOpen(false);
    router.push("/my-cart");
  };

  // Add to cart function
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

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...cart, cartItem];
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

      {/* Search Bar */}
    
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
            <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>
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
              <div className={`relative rounded-lg border transition-colors ${
                selectedFreeProduct?._id === bogoProduct._id 
                  ? "border-primary" 
                  : "border-border hover:border-primary/50"
              }`}>
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
        <p className="text-xs text-muted-foreground">2nd Pair - Free</p>
      </div>

      {/* Small Product Image */}
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 bg-white rounded-lg border overflow-hidden">
          <img 
            src={selectedFreeProduct.images[0]?.asset.url} 
            alt={selectedFreeProduct.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Compact Product Info */}
      <div className="text-center mb-3">
        <h4 className="font-medium text-sm mb-1 line-clamp-2">{selectedFreeProduct.name}</h4>
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
              variant={selectedFreeProductSize === size ? "default" : "outline"}
              size="sm"
              className={`
                min-w-[40px] h-8 text-xs font-normal
                ${selectedFreeProductSize === size 
                  ? "bg-primary text-primary-foreground" 
                  : ""
                }
              `}
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
                onClick={confirmFreeProductSize}
                disabled={!selectedFreeProduct || !selectedFreeProductSize}
                className="min-w-[140px] h-11 font-medium"
              >
                {selectedFreeProductSize ? (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
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
          <DialogTitle>Select Sizes</DialogTitle>
        </DialogHeader>

        {/* Conditionally render ProductCard2 for the selected product */}
        {selectedFreeProduct ? (
          <>
            {/* Free Product Section */}
            <div className="flex justify-center">
              <ProductCard2 product={selectedFreeProduct} />
            </div>
            {/* <Label>
              Select Size for {selectedFreeProduct.productName}&nbsp;
              <Badge variant={"secondary"}>Free Product</Badge>
            </Label> */}
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
            <div className="w-full flex my-2 justify-center  mx-auto">
              <ProductCard2 product={selectedProduct} />
            </div>
            {/* <Label>Select Size for {selectedProduct?.productName}</Label> */}
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
                  ? confirmFreeProductSize
                  : confirmMainProductSize
              }
              className="w-full "
              disabled={
                !selectedSize ||
                (selectedFreeProduct && !selectedFreeProductSize)
              }
            >
              {selectedFreeProduct ? "Confirm & Go to Cart" : "Confirm Size"}
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
