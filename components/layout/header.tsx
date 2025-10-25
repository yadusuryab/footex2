import Link from "next/link";
import { Suspense } from "react";

// Use dynamic imports for non-critical components
const Brand = dynamic(() => import("../brand/brand"), {
  loading: () => <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />,
});

import dynamic from "next/dynamic";
import { Instagram } from "lucide-react";
import { site } from "@/lib/site-config";
import { Button } from "../ui/button";
import {
  IconBrandInstagram,
  IconBrandInstagramFilled,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

const Header = () => {
  return (
    <>
      {/* Main Header */}
      <header className="fixed top-4  left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[500px]">
        <div className="bg-primary   rounded-full px-6 py-3">
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

            <div className="flex items-center gap-4">
              {" "}
              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                className="flex items-center gap-2 "
              >
                <IconBrandInstagram />
              </Link>
              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                className="flex items-center gap-2 "
              >
                <IconBrandWhatsapp />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;
