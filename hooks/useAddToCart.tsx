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
  
  // Add BOGO-specific pagination states
  const [bogoOffset, setBogoOffset] = useState<number>(0);
  const [bogoHasMore, setBogoHasMore] = useState<boolean>(true);
  const [bogoLoading, setBogoLoading] = useState<boolean>(false);
  const [allBogoProducts, setAllBogoProducts] = useState<Product[]>([]);

  // Memoized handlers
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedFreeProduct(null);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  }, []);

  // Load more BOGO products
  const loadMoreBogoProducts = useCallback(async () => {
    if (bogoLoading || !bogoHasMore) return;
    
    try {
      setBogoLoading(true);
      const { getAllShoes } = await import("@/lib/vehicleQueries");
      const data: any = await getAllShoes(null, 24, bogoOffset);
      
      if (data?.length) {
        const newBogoProducts = data.filter((item: Product) => item.buyOneGetOne);
        setAllBogoProducts(prev => [...prev, ...newBogoProducts]);
        setBogoHasMore(data.length === 24);
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

  // Initialize BOGO products when modal opens
  useEffect(() => {
    if (isBogoModalOpen && allBogoProducts.length === 0) {
      loadMoreBogoProducts();
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

  // BOGO scroll handler
  const handleBogoScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !bogoLoading && bogoHasMore) {
      loadMoreBogoProducts();
    }
  }, [bogoLoading, bogoHasMore, loadMoreBogoProducts]);

  // Optimized BOGO modal
  const renderBogoPage = useCallback((initialBogoProducts: Product[]) => {
    if (!isBogoModalOpen || !selectedProduct) return null;

    // Combine initial products with loaded BOGO products
    const combinedBogoProducts = [...initialBogoProducts, ...allBogoProducts];
    const filteredProducts = filteredBogoProducts(combinedBogoProducts);

    return (
      <div className="fixed inset-0 mt-2 bg-background h-full z-50 p-4 overflow-y-auto">
        <SHeading title="Select 2nd Pair" nolink />

        {/* Selected Product Preview */}
        {selectedProduct && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 bg-white rounded border overflow-hidden flex-shrink-0">
              <img
                src={selectedProduct.imageUrl || "/placeholder-image.jpg"}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
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

        {/* Product Grid with scroll handling */}
        <div 
          className="grid md:grid-cols-3 grid-cols-2 gap-4 mb-20 max-h-[60vh] overflow-y-auto"
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
          
          {/* Loading indicator */}
          {bogoLoading && (
            <div className="col-span-full text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading more products...</p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {selectedFreeProduct ? (
                  <>
                    <div className="w-12 h-12 bg-white rounded border overflow-hidden flex-shrink-0">
                      <img
                        src={selectedFreeProduct.imageUrl || "/placeholder-image.jpg"}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
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