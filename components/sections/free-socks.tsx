"use client";

import Image from "next/image";
import { Flame } from "lucide-react";
import { Badge } from "../ui/badge";

export function FreeSocksPromo() {
  return (
    <div className="relative rounded-2xl max-w-[360px] mx-auto overflow-hidden bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 shadow-lg">
      {/* diagonal ribbon */}
      <div className="absolute -left-10 tracking-tighter z-10 top-4 rotate-[-35deg] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-yellow-200  text-md shadow-lg font-bold px-10 py-1 ">
        MEGA OFFER
      </div>

      <div className="flex flex-col p-2  items-center">
        <div className="relative w-full h-52 sm:h-44 shrink-0">
          <Image
            src="/promo/2.jpeg"
            alt="Free flame socks with shoes"
            fill
            className="object-cover  rounded-xl "
          />
        </div>

        <div className="flex-1 p-2 py-6 text-white">
          <div className="flex items-center gap-1 text-yellow-200 tracking-tight text-xs font-bold uppercase mb-1">
            <Flame className="w-4 h-4" />
            Buy 1 Get 1 Shoe, Get Socks Free
          </div>
          <p className="text-xl font-extrabold tracking-tighter leading-tight">
            FREE FLAME SOCKS ON EVERY ORDER
          </p>
          <div className="text-sm mt-1 flex flex-wrap gap-2 text-white/90">
          <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
            Pan-India Delivery
          </Badge>
          <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
            COD Available
          </Badge>
          <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
            OFFER ENDS SOON
          </Badge>
          </div>

         
        </div>
      </div>
    </div>
  );
}