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
  RotateCcw, ArrowDown 
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
  // Render BOGO modal
  const renderBogoPage = (bogoProducts: Product[]) => {
    if (!isBogoModalOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-background z-50 p-4 overflow-y-auto">
        {/* Minimal Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Select 2nd Pair</h2>
          <p className="text-muted-foreground text-sm">
            choose your second pair.
          </p>
        </div>
  
        {/* Search Bar */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search by colors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <span>Select size</span>
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
                    }}
                  />
                  
                  {selectedFreeProduct?._id === bogoProduct._id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
  
                {/* Minimal Size Selector */}
                {selectedFreeProduct?._id === bogoProduct._id && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-2 text-center">Select size</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {bogoProduct.sizes.map((size: string) => (
                        <Button
                          key={size}
                          size="sm"
                          variant={selectedFreeProductSize === size ? "default" : "outline"}
                          className={`min-w-[45px] ${
                            selectedFreeProductSize === size ? "bg-primary" : ""
                          }`}
                          onClick={() => setSelectedFreeProductSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
  
        {/* Minimal Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Selection Status */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {selectedFreeProduct ? (
                  <>
                    <div className="w-8 h-8 bg-muted rounded border overflow-hidden flex-shrink-0">
                      <img 
                        src={selectedFreeProduct.images[0]?.asset.url} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        Free pair selected
                      </p>
                      <div className="flex items-center gap-2">
                        {selectedFreeProductSize ? (
                          <span className="text-xs text-green-600">
                            Size {selectedFreeProductSize}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600">
                            Size needed
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select a free pair
                  </div>
                )}
              </div>
  
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
              
                <Button
                  size="lg"
                  onClick={confirmFreeProductSize}
                  disabled={!selectedFreeProduct || !selectedFreeProductSize}
                  className="min-w-[120px]"
                >
                  {selectedFreeProductSize ? "Add to Cart" : "Select Size"}
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
