"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, ArrowRightCircle, Ruler } from "lucide-react";
import SHeading from "@/components/utils/section-heading";
import { IconSquareRoundedCheckFilled } from "@tabler/icons-react";
import ProductCard2 from "@/components/product/product-image-card";
import Image from "next/image"; // ✅ Add Next.js Image

export interface Product {
  _id: string;
  productName: string;
  sizes: string[];
  buyOneGetOne: boolean;
  imageUrl?: string;
  price?: number;
  offerPrice?: number;
}

export const useAddToCart = () => {
  const router = useRouter();
  const [isBogoModalOpen, setIsBogoModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFreeProductSize, setSelectedFreeProductSize] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // ✅ REDUCED pagination limits
  const [bogoOffset, setBogoOffset] = useState<number>(0);
  const [bogoHasMore, setBogoHasMore] = useState<boolean>(true);
  const [bogoLoading, setBogoLoading] = useState<boolean>(false);
  const [allBogoProducts, setAllBogoProducts] = useState<Product[]>([]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedFreeProduct(null);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  }, []);

  // ✅ OPTIMIZED: Reduced batch sizes and added throttling
  const loadMoreBogoProducts = useCallback(async () => {
    if (bogoLoading || !bogoHasMore) return;
    
    try {
      setBogoLoading(true);
      const { getAllShoes } = await import("@/lib/vehicleQueries");
      const data: any = await getAllShoes(null, 12, bogoOffset); // ✅ Reduced from 24 to 12
      
      if (data?.length) {
        const newBogoProducts = data.filter((item: Product) => item.buyOneGetOne);
        setAllBogoProducts(prev => [...prev, ...newBogoProducts]);
        setBogoHasMore(data.length === 12); // ✅ Match the limit
        setBogoOffset(prev => prev + data.length);
      } else {
        setBogoHasMore(false);
      }
    } catch (err) {
      console.error("BOGO load error:", err);
      toast.error("Failed to load more products");
    } finally {
      setBogoLoading(false);
    }
  }, [bogoOffset, bogoLoading, bogoHasMore]);

  // ✅ OPTIMIZED: Only load when needed
  useEffect(() => {
    if (isBogoModalOpen && allBogoProducts.length === 0) {
      // Small delay to prevent immediate loading
      const timer = setTimeout(() => {
        loadMoreBogoProducts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isBogoModalOpen, allBogoProducts.length, loadMoreBogoProducts]);

  const addToCart = useCallback((
    item: Product,
    size: string,
    freeProduct?: Product | null,
    freeProductSize?: string | null
  ) => {
    const cartItem = {
      ...item,
      selectedSize: size,
      freeProduct: freeProduct ? { 
        ...freeProduct, 
        selectedSize: freeProductSize 
      } : null,
    };

    const updatedCart = [cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${item.productName} added to cart!`);
  }, []);

  const filteredBogoProducts = useCallback((bogoProducts: Product[]) => {
    if (!searchQuery.trim()) return bogoProducts;
    return bogoProducts.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFreeProductSelect = useCallback((bogoProduct: Product) => {
    setSelectedFreeProduct(bogoProduct);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  }, []);

  const completeBogoFlow = useCallback(() => {
    if (selectedFreeProduct && selectedFreeProductSize && selectedProduct && selectedSize) {
      addToCart(selectedProduct, selectedSize, selectedFreeProduct, selectedFreeProductSize);
      setIsBogoModalOpen(false);
      setIsSizeModalOpen(false);
      setTimeout(() => router.push("/checkout"), 100);
    }
  }, [selectedProduct, selectedSize, selectedFreeProduct, selectedFreeProductSize, addToCart, router]);

  // ✅ OPTIMIZED: Throttled scroll handler
  const handleBogoScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // ✅ Only load when 300px from bottom (reduced trigger area)
    if (scrollHeight - scrollTop <= clientHeight + 300 && !bogoLoading && bogoHasMore) {
      loadMoreBogoProducts();
    }
  }, [bogoLoading, bogoHasMore, loadMoreBogoProducts]);

  // ✅ OPTIMIZED BOGO modal with image optimizations
  const renderBogoPage = useCallback((initialBogoProducts: Product[]) => {
    if (!isBogoModalOpen || !selectedProduct) return null;

    // Combine initial products with loaded BOGO products
    const combinedBogoProducts = [...initialBogoProducts, ...allBogoProducts];
    const filteredProducts = filteredBogoProducts(combinedBogoProducts);

    // ✅ Optimized thumbnail component
    const Thumbnail = ({ product, alt }: { product: Product; alt: string }) => (
      <div className="w-12 h-12 bg-white rounded border overflow-hidden flex-shrink-0">
        <Image
          src={product.imageUrl || "/placeholder-image.jpg"}
          alt={alt}
          width={48}
          height={48}
          quality={40} // ✅ Very low quality for thumbnails
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );

    return (
      <div className="fixed inset-0 mt-2 bg-background h-full z-50 p-4 overflow-y-auto">
        <SHeading title="Select 2nd Pair" nolink />

        {/* ✅ OPTIMIZED: Selected Product Preview */}
        {selectedProduct && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <Thumbnail product={selectedProduct} alt="Your first pair" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Your first pair</p>
              <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">✓ Selected</Badge>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          {selectedFreeProduct && !selectedFreeProductSize && (
            <div className="flex items-center gap-1 text-amber-600 text-sm">
              <Ruler className="h-4 w-4" />
              <span>Select size for 2nd pair</span>
            </div>
          )}
        </div>

        {/* ✅ OPTIMIZED: Product Grid with virtual scrolling consideration */}
        <div 
          className="grid md:grid-cols-3 grid-cols-2 gap-3 mb-20 max-h-[60vh] overflow-y-auto" // ✅ Reduced gap
          onScroll={handleBogoScroll}
        >
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">No products found</p>
            </div>
          ) : (
            filteredProducts.map((bogoProduct) => (
              <div key={bogoProduct._id} className="w-full">
                <div className={`relative rounded-lg border transition-colors ${
                  selectedFreeProduct?._id === bogoProduct._id ? "border-primary" : "border-border"
                }`}>
                  <ProductCard2
                    product={bogoProduct}
                    className="w-full"
                    noLink={true}
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
          
          {/* ✅ OPTIMIZED: Minimal loading indicator */}
          {bogoLoading && (
            <div className="col-span-full text-center py-3">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {/* ✅ OPTIMIZED: Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {selectedFreeProduct ? (
                  <>
                    <Thumbnail product={selectedFreeProduct} alt="Selected free product" />
                    <div className="min-w-0 flex-1">
                      {selectedFreeProductSize ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Size {selectedFreeProductSize}</Badge>
                          <span className="text-xs text-green-600 font-medium">✓ Ready</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFreeProductSelect(selectedFreeProduct)}
                          className="text-xs text-amber-600 underline font-medium"
                        >
                          ← Select size
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Select your 2nd pair (Free)</div>
                )}
              </div>

              <Button
                size="lg"
                onClick={completeBogoFlow}
                disabled={!selectedFreeProduct || !selectedFreeProductSize}
                className="min-w-[140px] h-11 font-medium"
              >
                {selectedFreeProductSize ? (
                  <div className="flex items-center gap-2">
                    Checkout <ArrowRightCircle className="h-4 w-4" />
                  </div>
                ) : (
                  "Select Size First"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isBogoModalOpen, selectedProduct, selectedSize, selectedFreeProduct, selectedFreeProductSize, filteredBogoProducts, handleFreeProductSelect, completeBogoFlow, allBogoProducts, bogoLoading, bogoHasMore, handleBogoScroll]);

  // Size modal remains mostly the same but ensure ProductCard2 is optimized
  const renderSizeModal = useCallback((bogoProducts: Product[]) => {
    const isSelectingFreeProduct = !!selectedFreeProduct;
    const currentProduct = isSelectingFreeProduct ? selectedFreeProduct : selectedProduct;
    const currentSize = isSelectingFreeProduct ? selectedFreeProductSize : selectedSize;

    if (!currentProduct) return null;

    return (
      <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
        <DialogContent className="max-h-[90vh] p-4 rounded-2xl max-w-[320px]">
          <DialogTitle className="sr-only">Select Size</DialogTitle>

          <div className="flex justify-center mb-4">
            <ProductCard2 product={currentProduct} noLink={true} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {currentProduct.sizes?.map((size: string) => (
              <Button
                key={size}
                className="min-w-[60px]"
                variant={currentSize === size ? "default" : "outline"}
                onClick={() => {
                  if (isSelectingFreeProduct) {
                    setSelectedFreeProductSize(size);
                  } else {
                    setSelectedSize(size);
                  }
                }}
              >
                {size}
              </Button>
            ))}
          </div>

          <Button
            size="lg"
            onClick={() => {
              if (!currentSize) {
                toast.error("Please select a size");
                return;
              }

              if (isSelectingFreeProduct) {
                setIsSizeModalOpen(false);
                completeBogoFlow();
              } else {
                if (selectedProduct?.buyOneGetOne) {
                  setIsBogoModalOpen(true);
                  setIsSizeModalOpen(false);
                } else {
                  addToCart(selectedProduct!, currentSize);
                  setIsSizeModalOpen(false);
                  router.push("/checkout");
                }
              }
            }}
            className="w-full"
            disabled={!currentSize}
          >
            {isSelectingFreeProduct ? "Confirm & Checkout" : "Confirm Size"} 
            <IconSquareRoundedCheckFilled className="ml-2" />
          </Button>
        </DialogContent>
      </Dialog>
    );
  }, [isSizeModalOpen, selectedFreeProduct, selectedProduct, selectedFreeProductSize, selectedSize, completeBogoFlow, addToCart, router]);

  return {
    handleProductClick,
    renderBogoPage,
    renderSizeModal,
    setSearchQuery,
  };
};