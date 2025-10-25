"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useAddToCart";
import SHeading from "../utils/section-heading";
import ProductCard2 from "./product-image-card";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Filter types
type FilterType = "all" | "with-extra" | "no-extra";

function ProductList({ price }: ProductListProps) {
  const [vehicles, setVehicles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bogoProducts, setBogoProducts] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(12);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

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

  // Filter products based on active filter
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    
    switch (activeFilter) {
      case "with-extra":
        return vehicles.filter((vehicle: any) => {
          const amount = parseFloat(vehicle.price) || 0;
          return amount > 999;
        });
      case "no-extra":
        return vehicles.filter((vehicle: any) => {
          const amount = parseFloat(vehicle.price) || 0;
          return amount <= 999;
        });
      case "all":
      default:
        return vehicles;
    }
  }, [vehicles, activeFilter]);

  // Simplified filtering for display
  const displayedVehicles = useMemo(() => {
    return filteredVehicles.slice(0, visibleItems);
  }, [filteredVehicles, visibleItems]);

  // Count products for each filter
  const filterCounts = useMemo(() => {
    if (!vehicles) return { all: 0, "with-extra": 0, "no-extra": 0 };
    
    const withExtra = vehicles.filter((vehicle: any) => {
      const amount = parseFloat(vehicle.price) || 0;
      return amount > 999;
    }).length;
    
    const noExtra = vehicles.filter((vehicle: any) => {
      const amount = parseFloat(vehicle.price) || 0;
      return amount <= 999;
    }).length;

    return {
      all: vehicles.length,
      "with-extra": withExtra,
      "no-extra": noExtra
    };
  }, [vehicles]);

  // Efficient infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!filteredVehicles || visibleItems >= filteredVehicles.length) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Load more when near bottom
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        setVisibleItems(prev => Math.min(prev + 8, filteredVehicles.length));
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
  }, [filteredVehicles, visibleItems]);

  // Reset visible items when filter changes
  useEffect(() => {
    setVisibleItems(12);
  }, [activeFilter]);

  // Auto-load more if page is not filled
  useEffect(() => {
    if (filteredVehicles && !loading) {
      const checkHeight = () => {
        if (document.documentElement.scrollHeight <= window.innerHeight * 1.2) {
          setVisibleItems(prev => Math.min(prev + 4, filteredVehicles.length));
        }
      };
      
      const timer = setTimeout(checkHeight, 50);
      return () => clearTimeout(timer);
    }
  }, [filteredVehicles, loading]);

  // Show immediate loading state
  if (loading && !vehicles) {
    return (
      <div className="">
        {/* Header */}
        <div className="md:mx-24">
          <SHeading
            title="Select 1st Pair"
           
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
    <div className="">
      {/* Header Section */}
      <div className="md:mx-24">
        <SHeading
          title="Select 1st pair"
          size="lg"
          nolink={true}
        />
      </div>

      {/* Filter Tabs */}
      {/* <div className="md:mx-24">
        <Tabs 
          value={activeFilter} 
          onValueChange={(value) => setActiveFilter(value as FilterType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All Shoes ({filterCounts.all})
            </TabsTrigger>
            <TabsTrigger value="with-extra">
              With Extra ({filterCounts["with-extra"]})
            </TabsTrigger>
            <TabsTrigger value="no-extra">
              No extra ({filterCounts["no-extra"]})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      {/* Results Info */}
      

      {/* Products Grid */}
      <div className="md:mx-24 mt-4">
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
        {visibleItems < filteredVehicles.length && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`more-${index}`} />
            ))}
          </div>
        )}

        {/* End of results */}
        {visibleItems >= filteredVehicles.length && filteredVehicles.length > 0 && (
          <div className="text-center py-8 border-t mt-8">
            <p className="text-muted-foreground">
              🎉 All {filteredVehicles.length} products loaded!
            </p>
          </div>
        )}
      </div>

      {/* No Results for Filter State */}
      {filteredVehicles.length === 0 && vehicles.length > 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Products Match Your Filter</h3>
          <p className="text-muted-foreground mb-6">
            Try selecting a different filter to see more products.
          </p>
          <Button onClick={() => setActiveFilter("all")}>
            Show All Products
          </Button>
        </div>
      )}

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