import Link from "next/link";
import Brand from "../brand/brand";
import CartButton from "../cart/cart-buttons/cart-count";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <>
      {/* Main Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[500px]">
        <div className="bg-primary/95 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Brand />
            </Link>

            {/* Cart Button */}
            <div className="relative">
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      {/* <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[500px] md:hidden">
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl px-4 py-2">
          <div className="flex items-center justify-around">
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="text-xs font-medium">Home</span>
              </Link>
            </Button>

     
            <div className="flex flex-col items-center gap-1 py-2 px-3">
              <CartButton showLabel />
            </div>
          </div>
        </div>
      </nav> */}

      {/* Spacing for fixed headers */}
    {/* Spacer for bottom nav (mobile only) */}
    </>
  );
};

export default Header;