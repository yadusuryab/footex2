"use client";
import { getAllShoes } from "@/lib/vehicleQueries";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useAddToCart";
import Splash from "../utils/splash";
import SHeading from "../utils/section-heading";
import ProductCard2 from "./product-image-card";
import throttle from "lodash.throttle";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, Grid3X3, List, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListProps {
  price?: string | null;
}

// Skeleton Loading Components
const ProductCardSkeleton = ({ variant = "grid" }: { variant?: "grid" | "list" }) => {
  if (variant === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg animate-pulse">
        <div className="w-24 h-24 bg-muted rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-8 bg-muted rounded flex-1"></div>
            <div className="h-8 bg-muted rounded w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-square bg-muted rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-3 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

const ControlsSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-card rounded-lg border animate-pulse">
    <div className="w-full sm:max-w-xs h-10 bg-muted rounded"></div>
    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
      <div className="w-[140px] h-10 bg-muted rounded"></div>
      <div className="flex border rounded-lg p-1">
        <div className="h-8 w-8 bg-muted rounded"></div>
        <div className="h-8 w-8 bg-muted rounded ml-1"></div>
      </div>
    </div>
  </div>
);

function ProductList({ price }: ProductListProps) {
  const [vehicles, setVehicles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bogoProducts, setBogoProducts] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const { handleProductClick, renderBogoPage, renderSizeModal } = useAddToCart();

  // Fetch products
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data: any = await getAllShoes(price);
        if (!data || !Array.isArray(data))
          throw new Error("Invalid product data");
        setVehicles(data);

        const bogoItems = data.filter((item: any) => item.buyOneGetOne);
        setBogoProducts(bogoItems);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [price]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Filter and sort products
  const filteredAndSortedVehicles = useMemo(() => {
    if (!vehicles) return [];

    let filtered = vehicles;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.shoeBrand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.productName?.localeCompare(b.productName));
        break;
      case "bogo":
        filtered = [...filtered].sort((a, b) => (b.buyOneGetOne ? 1 : 0) - (a.buyOneGetOne ? 1 : 0));
        break;
      default:
        // featured - keep original order or apply your featured logic
        break;
    }

    return filtered;
  }, [vehicles, searchQuery, sortBy]);

  // Displayed vehicles with infinite scroll
  const displayedVehicles = useMemo(
    () => filteredAndSortedVehicles.slice(0, visibleItems),
    [filteredAndSortedVehicles, visibleItems]
  );

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && displayedVehicles.length < filteredAndSortedVehicles.length) {
      setIsLoadingMore(true);
      // Simulate loading time
      setTimeout(() => {
        setVisibleItems((prev) => prev + 6); // Load 6 products per scroll
        setIsLoadingMore(false);
      }, 500);
    }
  }, [isLoadingMore, displayedVehicles.length, filteredAndSortedVehicles.length]);

  // Infinite scroll with loading state
  const handleScroll = useCallback(
    throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Load more when user scrolls to 80% of the page
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMoreProducts();
      }
    }, 300),
    [loadMoreProducts]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-load more products when component mounts if the page is not filled
  useEffect(() => {
    if (!loading && vehicles && vehicles.length > 0) {
      const checkIfNeedMoreProducts = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        // If content height is less than viewport height, load more
        if (scrollHeight <= clientHeight * 1.5 && displayedVehicles.length < filteredAndSortedVehicles.length) {
          loadMoreProducts();
        }
      };

      // Check after a small delay to allow DOM to update
      setTimeout(checkIfNeedMoreProducts, 100);
    }
  }, [loading, vehicles, displayedVehicles.length, filteredAndSortedVehicles.length, loadMoreProducts]);

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItems(12);
  }, [searchQuery, sortBy]);

  // Render skeleton loading for initial load
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Section Skeleton */}
        <div className="md:mx-24">
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-24 mx-auto"></div>
          </div>
        </div>

        {/* Controls Skeleton */}
        <div className="md:mx-24">
          <ControlsSkeleton />
        </div>

        {/* Results Info Skeleton */}
        <div className="md:mx-24">
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse mb-4"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="md:mx-24">
          <div className={
            viewMode === "grid" 
              ? "grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4"
              : "grid grid-cols-1 gap-4"
          }>
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} variant={viewMode} />
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
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Please check back later or contact us for more information.
        </p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
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

      {/* Controls Bar */}
      <div className="md:mx-24">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-card rounded-2xl shadow-sm">
          {/* Search */}
          {/* <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div> */}

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy} >
              <SelectTrigger className="w-[140px] border-none">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="bogo">BOGO First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex  rounded-full p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="md:mx-24">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>
            Showing {displayedVehicles.length} of {filteredAndSortedVehicles.length} products
          </span>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="md:mx-24">
        <div className={
          viewMode === "grid" 
            ? "grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4"
            : "grid grid-cols-1 gap-4"
        }>
          {displayedVehicles.map((vehicle: any) => (
            <ProductCard2
              key={vehicle._id}
              product={vehicle}
              className="w-full"
              variant={viewMode}
              onClick={() => handleProductClick(vehicle)}
            />
          ))}

          {/* Show skeleton loading when loading more items */}
          {isLoadingMore && 
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} variant={viewMode} />
            ))
          }
        </div>

        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more products...</span>
            </div>
          </div>
        )}

        {/* End of Results */}
        {displayedVehicles.length >= filteredAndSortedVehicles.length && 
         filteredAndSortedVehicles.length > 0 && (
          <div className="text-center py-8 border-t mt-8">
            <p className="text-muted-foreground">
              🎉 You've seen all {filteredAndSortedVehicles.length} products!
            </p>
          </div>
        )}
      </div>

      {/* No Results State */}
      {filteredAndSortedVehicles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Matching Products</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button onClick={() => { setSearchQuery(""); setSortBy("featured"); }}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Render modals from the hook */}
      {renderBogoPage(bogoProducts)}
      {renderSizeModal(bogoProducts)}
    </div>
  );
}

export default ProductList;