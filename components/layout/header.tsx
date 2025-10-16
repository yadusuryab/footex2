import Link from "next/link";
import { Suspense } from "react";

// Use dynamic imports for non-critical components
const Brand = dynamic(() => import("../brand/brand"), {
  loading: () => <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />,
});

const CartButton = dynamic(() => import("../cart/cart-buttons/cart-count"), {
  loading: () => <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />,
});

import dynamic from "next/dynamic";
import { Instagram } from "lucide-react";
import { site } from "@/lib/site-config";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <>
      {/* Main Header */}
      <header className="fixed top-4  left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[500px]">
        <div className="bg-primary   rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Suspense
                fallback={
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
                }
              >
                <Brand />
              </Suspense>
            </Link>

            <Link href={site.instagram} className="flex items-center gap-2 ">
              <Button
                variant={"secondary"}
                size={"icon"}
                className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 hover:from-purple-700 hover:via-pink-700 hover:to-orange-500 text-white  hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Suspense
                  fallback={
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
                  }
                >
                  <Instagram />
                </Suspense>
              </Button>
            </Link>

            {/* Cart Button */}
            {/* <div className="relative">
              <Suspense fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                <CartButton />
              </Suspense>
            </div> */}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;
