import { client } from "@/sanityClient";

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// For getAllShoes (listing pages)
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

  // INCREASED QUALITY - Better but still efficient
  const query = `*[_type == "shoe" ${priceFilter}] | order(orderNumber asc) [${offset}...${offset + limit}] {
    _id,
    productName,
    sizes,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    "imageUrl": images[0].asset->url + "?w=400&h=400&auto=format&q=85&fit=crop" // Increased from 250px & q=75
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

// For getShoeById (detail pages) - HIGHER QUALITY
export const getShoeById = async (id: string): Promise<any | undefined> => {
  const cacheKey = `shoe-${id}`;
  
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // SIGNIFICANT QUALITY INCREASE
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
    // HIGH QUALITY images - perfect for product details
    "images": images[0...4] { // Show more images
      "url": asset->url + "?w=800&h=800&auto=format&q=90&fit=fillmax", // High quality for zoom
      "thumbnail": asset->url + "?w=200&h=200&auto=format&q=80&fit=crop" // Better thumbnails
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