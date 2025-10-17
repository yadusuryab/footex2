"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useAddToCart";
import SHeading from "../utils/section-heading";
import ProductCard2 from "./product-image-card";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from "lucide-react";

interface ProductListProps {
  price?: string | null;
}

// Simple skeleton component
const ProductCardSkeleton = ({ variant = "grid" }: { variant?: "grid" | "list" }) => (
  <div className={`
    animate-pulse bg-muted rounded-lg
    ${variant === "list" ? "flex gap-4 p-4 h-32" : "aspect-square"}
  `}></div>
);

function ProductList({ price }: ProductListProps) {
  const [vehicles, setVehicles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bogoProducts, setBogoProducts] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(12);

  const { handleProductClick, renderBogoPage, renderSizeModal } = useAddToCart();

  // Optimized fetch with minimal processing
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Import directly to avoid any initialization delays
        const { getAllShoes } = await import("@/lib/vehicleQueries");
        const data: any = await getAllShoes(price);
        
        if (data?.length) {
          setVehicles(data);
          // Filter BOGO products simultaneously
          const bogoItems = data.filter((item: any) => item.buyOneGetOne);
          setBogoProducts(bogoItems);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [price]);

  // Show error immediately
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Simplified filtering - remove heavy computations
  const displayedVehicles = useMemo(() => {
    if (!vehicles) return [];
    return vehicles.slice(0, visibleItems);
  }, [vehicles, visibleItems]);

  // Efficient infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!vehicles || visibleItems >= vehicles.length) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Load more when near bottom
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        setVisibleItems(prev => Math.min(prev + 8, vehicles.length));
      }
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [vehicles, visibleItems]);

  // Auto-load more if page is not filled
  useEffect(() => {
    if (vehicles && !loading) {
      const checkHeight = () => {
        if (document.documentElement.scrollHeight <= window.innerHeight * 1.2) {
          setVisibleItems(prev => Math.min(prev + 4, vehicles.length));
        }
      };
      
      const timer = setTimeout(checkHeight, 50);
      return () => clearTimeout(timer);
    }
  }, [vehicles, loading]);

  // Show immediate loading state
  if (loading && !vehicles) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="md:mx-24">
          <SHeading
            title="Select Your First Pair"
            description="Choose the perfect first pair for your BOGO deal"
            badge="Buy one get one."
            size="lg"
            nolink={true}
          />
        </div>

        {/* Products Grid Skeleton */}
        <div className="md:mx-24">
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-6">
          Check back later for new arrivals.
        </p>
        <Button onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="md:mx-24">
        <SHeading
          title="Select Your First Pair"
          description="Choose the perfect first pair for your BOGO deal"
          badge="Buy one get one."
          size="lg"
          nolink={true}
        />
      </div>

      {/* Results Info */}
      <div className="md:mx-24">
        <div className="text-sm text-muted-foreground mb-4">
          Showing {Math.min(visibleItems, vehicles.length)} of {vehicles.length} products
        </div>
      </div>

      {/* Products Grid */}
      <div className="md:mx-24">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {displayedVehicles.map((vehicle: any) => (
            <ProductCard2
              key={vehicle._id}
              product={vehicle}
              className="w-full"
              variant="grid"
              onClick={() => handleProductClick(vehicle)}
            />
          ))}
        </div>

        {/* Loading more skeletons */}
        {visibleItems < vehicles.length && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`more-${index}`} />
            ))}
          </div>
        )}

        {/* End of results */}
        {visibleItems >= vehicles.length && vehicles.length > 0 && (
          <div className="text-center py-8 border-t mt-8">
            <p className="text-muted-foreground">
              🎉 All {vehicles.length} products loaded!
            </p>
          </div>
        )}
      </div>

      {/* No Results State */}
      {vehicles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      )}

      {/* Render modals */}
      {renderBogoPage(bogoProducts)}
      {renderSizeModal(bogoProducts)}
    </div>
  );
}

export default React.memo(ProductList);