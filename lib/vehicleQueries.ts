import { client } from "@/sanityClient";

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const getAllShoes = async (price?: string | null, limit: number = 24, offset: number = 0): Promise<any[] | undefined> => {
  const cacheKey = `shoes-${price}-${limit}-${offset}`;
  
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let priceFilter = "";
  if (price === "999" || price === "499") {
    priceFilter = `&& price == ${price}`;
  }

  // Optimized query - balanced between quality and size
  const query = `*[_type == "shoe" ${priceFilter}] | order(orderNumber asc) [${offset}...${offset + limit}] {
    _id,
    productName,
    sizes,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    "imageUrl": images[0].asset->url + "?w=250&h=250&auto=format&q=75" // Better quality but still optimized
  }`;

  try {
    const shoes = await client.fetch(query);
    
    cache.set(cacheKey, {
      data: shoes,
      timestamp: Date.now()
    });
    
    return shoes;
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return undefined;
  }
};

// In vehicleQueries.ts - ULTRA OPTIMIZED
export const getShoeById = async (id: string): Promise<any | undefined> => {
  const cacheKey = `shoe-${id}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // MINIMAL query - only essential fields + optimized images
  const query = `*[_type == "shoe" && _id == $id][0] {
    _id,
    productName,
    shoeBrand,
    category,
    sizes,
    colorVariants,
    description,
    madeIn,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    // Optimized images - only first 3 with CDN parameters
    "images": images[0...3] {
      "url": asset->url + "?w=600&h=600&auto=format&q=80",
      "thumbnail": asset->url + "?w=150&h=150&auto=format&q=70"
    }
  }`;

  try {
    const shoe = await client.fetch(query, { id });
    
    if (shoe) {
      cache.set(cacheKey, {
        data: shoe,
        timestamp: Date.now()
      });
    }
    
    return shoe || undefined;
  } catch (error) {
    console.error("Error fetching shoe:", error);
    return undefined;
  }
};
// Keep other functions the same
export const addToCart = (shoe: any) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!cart.some((item: any) => item._id === shoe._id)) {
    const updatedCart = [...cart, shoe];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
};