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
import { IconAlertSquareRoundedFilled, IconSearch } from "@tabler/icons-react";
import Image from "next/image";

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
  const renderBogoPage = (bogoProducts: Product[]) => {
    if (!isBogoModalOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-background z-50 p-4 overflow-y-auto">
        <h2 className="text-xl text-center font-semibold mb-4">SELECT 2ND PAIR</h2>
  
        {/* Search Bar */}
        <div className="relative w-full mb-6">
  <input
    type="text"
    placeholder="Search by colors (e.g., Black, Green, Gray...)"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full rounded-full bg-muted/30 shadow-xl px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
  />
  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-muted-foreground pointer-events-none">
    <IconSearch/>
  </div>
</div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4 mb-10">
          {!filteredBogoProducts && <h2>No Products</h2>}
          {filteredBogoProducts(bogoProducts).map((bogoProduct) => (
            <div key={bogoProduct._id} className="w-full">
              <ProductCard2
                ybg={false}
                product={bogoProduct}
                className={`w-full ${
                  selectedFreeProduct?._id === bogoProduct._id ? "border-2 border-primary" : ""
                }`}
                onClick={() => {
                  setSelectedFreeProduct(bogoProduct);
                  setSelectedFreeProductSize(null); // reset size
                }}
              />
  
              {/* Show size selector below the selected free product */}
              {selectedFreeProduct?._id === bogoProduct._id && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {bogoProduct.sizes.map((size: string) => (
                    <Button
                      key={size}
                      variant={selectedFreeProductSize === size ? "default" : "secondary"}
                      onClick={() => setSelectedFreeProductSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
  
        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-lg">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 ">
                <Image src={selectedProduct.images[0]?.asset.url}alt="Footex selected product" className="rounded-full" width={100} height={100}/>
                <div>
                {!selectedFreeProduct && <p className="italic text-sm mb-2 inline-flex"> <IconAlertSquareRoundedFilled/><span>Select a pair of shoes (it's free) to Continue.</span></p>}
                <Button
        size={'lg'}
          onClick={
            
             confirmFreeProductSize
          
          }
          className="w-full "
          disabled={
            (!selectedFreeProduct && !selectedFreeProductSize)
          }
        >

        Confirm & Go to Cart
        </Button>
                </div>
                {/* <span className="font-medium">{selectedProduct.productName}</span> */}
              </div>
  
             
            </div>
          )}
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
          <div >
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
        size={'lg'}
          onClick={
            selectedFreeProduct
              ? confirmFreeProductSize
              : confirmMainProductSize
          }
          className="w-full "
          disabled={
            !selectedSize || (selectedFreeProduct && !selectedFreeProductSize)
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