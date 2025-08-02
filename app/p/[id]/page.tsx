import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanityClient";
import { Badge } from "@/components/ui/badge";
 // Updated function name
import { site } from "@/lib/site-config";

import { getShoeById } from "@/lib/vehicleQueries";
import ProductCarousel from "@/components/product/product-carousel";

import SHeading from "@/components/utils/section-heading";
import AddToCartButton from "@/components/cart/cart-buttons/add-to-cart";

interface ProductProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getShoeById(resolvedParams.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const { productName, price, images } = product;
  const ogImage = urlFor(images[0]?.asset.url).url();
  const ogDescription = `Check out the ${productName} priced at ₹${price.toLocaleString()}. Available now!`;

  return {
    title: `${productName} - Product Details`,
    description: ogDescription,
    openGraph: {
      title: `${productName} - Product Details`,
      description: ogDescription,
      images: [{ url: ogImage, alt: productName, width: 800, height: 600 }],
    },
  };
}

export default async function ProductPage({ params }: any) {
  const resolvedParams = await params;
  const product: any = await getShoeById(resolvedParams.id);

  if (!product) return notFound();

  const { productName, shoeBrand, category, sizes, colorVariants, images, description, madeIn, price, isOffer, offerPrice, buyOneGetOne } = product;
  const message = `Hi, I am interested in the ${shoeBrand} ${productName}.
  - Price: ₹${isOffer ? offerPrice.toLocaleString() : price.toLocaleString()}
  - Category: ${category}
  - Sizes Available: ${sizes?.join(", ")}
  - Colors: ${colorVariants?.join(", ")}
  
  Check it out here: ${process.env.NEXT_PUBLIC_BASE_URL}/p/${resolvedParams.id}`;

  return (
    <div className="md:mx-28 mx-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Product Carousel */}
        <ProductCarousel images={images} productName={productName} />

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <p className="uppercase text-md font-semibold text-muted-foreground">
              {shoeBrand || site.name}
            </p>
            <h2 className="text-lg md:text-2xl font-bold uppercase">{productName}</h2>
          </div>

          <div className="flex gap-4 items-center">
            <Badge className="rounded-md">{category?.toUpperCase()}</Badge>
            <Badge className="rounded-md" variant={'secondary'}>Sizes {sizes?.join(", ")}</Badge>
          </div>

          {/* Price Section */}
          <div className="col-span-2">
            {isOffer ? (
              <div className="flex items-center gap-4">
                <p className="font-bold text-xl">
                  ₹{new Intl.NumberFormat("en-IN").format(offerPrice)}
                </p>
                <p className="text-lg font-extrabold text-muted-foreground line-through">
                  ₹{new Intl.NumberFormat("en-IN").format(price)}
                </p>
                <span className="text-sm font-bold text-green-600 ml-2">
                  {Math.round(((price - offerPrice) / price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <p className="font-bold text-xl">
                ₹{new Intl.NumberFormat("en-IN").format(price)}
              </p>
            )}
          </div>

          {/* Buy One Get One Offer */}
          {buyOneGetOne && (
            <div className="text-yellow-600 font-bold text-sm">
              🎁 Buy 1 Get 1 Free!
            </div>
          )}

          {/* Action Buttons */}
          <div>
            <Link href={`https://wa.me/${site.phone}?text=${encodeURIComponent(message)}`} target="_blank">
              <Button className="w-full bg-green-500 text-white hover:bg-green-600">
                <MessageCircle /> Chat via WhatsApp
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`tel:${site.phone}`} target="_blank">
              <Button className="w-full" variant={"secondary"}>
                <PhoneCall /> Enquire via Phone
              </Button>
            </Link>
            <AddToCartButton product={product} />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <SHeading title="About This Product" description={description} nolink={true} />
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Brand</p>
              <p>{shoeBrand || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Made In</p>
              <p>{madeIn || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Sizes Available</p>
              <p>{sizes?.join(", ") || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Colors Available</p>
              <p>{colorVariants?.join(", ") || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Price</p>
              <p>
                {isOffer ? (
                  <>
                    ₹{new Intl.NumberFormat("en-IN").format(offerPrice)}{" "}
                    <span className="text-muted-foreground line-through">
                      ₹{new Intl.NumberFormat("en-IN").format(price)}
                    </span>
                  </>
                ) : (
                  `₹${new Intl.NumberFormat("en-IN").format(price)}`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
