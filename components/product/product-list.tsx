"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useAddToCart";
import SHeading from "../utils/section-heading";
import ProductCard2 from "./product-image-card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ProductListProps {
  price?: string | null;
}

const ProductCardSkeleton = () => (
  <div className="animate-pulse bg-muted rounded-lg aspect-square"></div>
);

function ProductList({ price }: ProductListProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);

  const { handleProductClick, renderBogoPage, renderSizeModal } = useAddToCart();

  // Single load function with pagination
  const loadProducts = useCallback(async (loadOffset: number = 0, loadLimit: number = 24) => {
    try {
      setLoading(true);
      const { getAllShoes } = await import("@/lib/vehicleQueries");
      const data: any = await getAllShoes(price, loadLimit, loadOffset);
      
      if (data?.length) {
        setVehicles(prev => loadOffset === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === loadLimit);
        setOffset(loadOffset + data.length);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [price]);

  // Initial load
  useEffect(() => {
    loadProducts(0, 24);
  }, [loadProducts]);

  // Load more - smaller batches
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadProducts(offset, 12);
    }
  }, [loading, hasMore, offset, loadProducts]);

  // Efficient scroll handler
  useEffect(() => {
    if (!hasMore || loading) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking && window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        ticking = true;
        loadMore();
        setTimeout(() => { ticking = false; }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, loading]);

  // Memoized BOGO products
  const bogoProducts = useMemo(() => 
    vehicles.filter(item => item.buyOneGetOne), 
    [vehicles]
  );

  if (loading && vehicles.length === 0) {
    return (
      <div className="">
        <div className="md:mx-24">
          <SHeading title="Select 1st Pair" size="lg" nolink={true} />
        </div>
        <div className="md:mx-24">
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
            {Array.from({ length: 12 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <Button onClick={() => loadProducts(0, 24)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="md:mx-24">
        <SHeading title="Select 1st pair" size="lg" nolink={true} />
      </div>

      <div className="md:mx-24 mt-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <ProductCard2
              key={vehicle._id}
              product={vehicle}
              className="w-full"
            
              noLink={true}
              onClick={() => handleProductClick(vehicle)}
            />
          ))}
        </div>

        {loading && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={`load-${i}`} />)}
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} variant="outline">
              Load More Products
            </Button>
          </div>
        )}

        {!hasMore && vehicles.length > 0 && (
          <div className="text-center py-8 border-t mt-8">
            <p className="text-muted-foreground">
              🎉 All {vehicles.length} products loaded!
            </p>
          </div>
        )}
      </div>

      {renderBogoPage(bogoProducts)}
      {renderSizeModal(bogoProducts)}
    </div>
  );
}

export default React.memo(ProductList);