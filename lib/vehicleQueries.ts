import { client } from "@/sanityClient";

export const getAllShoes = async (price?: string | null): Promise<any[] | undefined> => {
  let priceFilter = "";
  if (price === "999" || price === "499") {
    priceFilter = `&& price == ${price}`;
  }

  const query = `*[_type == "shoe" ${priceFilter}] {
    _id,
    productName,
    shoeBrand,
    category,
    sizes,
    colorVariants,
    images[] {
      asset -> {
        url
      }
    },
    description,
    madeIn,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    stock
  }`;

  try {
    const shoes = await client.fetch(query);
    return shoes;
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return undefined;
  }
};

export const getShoeById = async (id: string): Promise<any | undefined> => {
  const query = `*[_type == "shoe" && _id == $id] {
    _id,
    productName,
    shoeBrand,
    category,
    sizes,
    colorVariants,
    images[] {
      asset -> {
        url
      }
    },
    description,
    madeIn,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    stock
  }`;

  try {
    const shoe = await client.fetch(query, { id });
    if (shoe.length === 0) {
      console.warn(`No shoe found for ID: ${id}`);
      return undefined;
    }
    return shoe[0];
  } catch (error) {
    console.error("Error fetching shoe by ID:", error);
    return undefined;
  }
};

export const searchShoes = async (keyword: string): Promise<any[] | undefined> => {
  const query = `*[_type == "shoe" && (
    productName match $keyword || 
    shoeBrand match $keyword || 
    category match $keyword || 
    colorVariants[] match $keyword
  )] {
    _id,
    productName,
    shoeBrand,
    category,
    sizes,
    colorVariants,
    images[] {
      asset -> {
        url
      }
    },
    description,
    madeIn,
    price,
    isOffer,
    offerPrice,
    buyOneGetOne,
    stock
  }`;

  try {
    const shoes = await client.fetch(query, { keyword: `*${keyword}*` });
    return shoes;
  } catch (error) {
    console.error("Error searching shoes:", error);
    return undefined;
  }
};

export const addToCart = (shoe: any) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!cart.some((item: any) => item._id === shoe._id)) {
    const updatedCart = [...cart, shoe];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
};

