"use client";
import { getAllShoes } from "@/lib/vehicleQueries";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/useAddToCart";
import Splash from "../utils/splash";
import SHeading from "../utils/section-heading";
import ProductCard2 from "./product-image-card";
import throttle from "lodash.throttle";



interface ProductListProps {
  price?: string | null;
}

function ProductList({ price }: ProductListProps) {
  const [vehicles, setVehicles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bogoProducts, setBogoProducts] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(6); // Number of items initially visible

  const { handleProductClick, renderBogoPage, renderSizeModal } = useAddToCart();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data: any = await getAllShoes(price);
        if (!data || !Array.isArray(data))
          throw new Error("Invalid product data");
        setVehicles(data);

        // Fetch BOGO products
        const bogoItems = data.filter((item: any) => item.buyOneGetOne);
        setBogoProducts(bogoItems);
      } catch (err) {
        setError("Failed to fetch vehicles.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (error) toast(error);
  }, [error]);

  // Infinite scroll logic
  const displayedVehicles = useMemo(
    () => vehicles?.slice(0, visibleItems) || [],
    [vehicles, visibleItems]
  );
  
  const handleScroll = useCallback(
    throttle(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 200
      ) {
        setVisibleItems((prev) => prev + 6);
      }
    }, 300), // throttle duration
    []
  );
  
  

useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (loading) return <Splash />;

  if (!vehicles || vehicles.length === 0) {
    return (
      <p className="font-bold text-sm p-4">
        No Products Found, Please contact the Store for more Information.
      </p>
    );
  }

  // const displayedVehicles = vehicles?.slice(0, visibleItems) || [];

  return (
    <div>
      <div className="md:mx-24">
        <SHeading
          title="Select First Pair"
          description="Choose first pair of your shoes."
          nolink={true}
        />
        {/* Grid layout for mobile (2 columns) and larger screens (4 columns) */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {displayedVehicles.map((vehicle: any) => (
            <ProductCard2
              key={vehicle._id}
              product={vehicle}
              className="w-full"
              onClick={() => handleProductClick(vehicle)}
            />
          ))}
        </div>
      </div>

      {/* Render modals from the hook */}
      {renderBogoPage(bogoProducts)}
      {renderSizeModal(bogoProducts)}
    </div>
  );
}

export default ProductList;