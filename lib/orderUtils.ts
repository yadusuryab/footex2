export interface CartItem {
    _id: string;
    productName: string;
    shoeBrand: string;
    images: { asset: { url: string } }[];
    offerPrice?: number;
    price: number;
    selectedSize?: number;
    buyOneGetOne: boolean;
    freeProduct?: CartItem | null;
    freeProductSize?: number;
  }
  
  export const calculateSubtotal = (cartItems: CartItem[]) =>
    cartItems.reduce((total, item) => total + (item.offerPrice || item.price), 0);
  
  export const calculateTotalAmount = (subtotal: number, shippingCharge: number) => {
    const cashfreeCommission = (subtotal + shippingCharge) * 0.02;
    return subtotal + shippingCharge + cashfreeCommission;
  };
  
  export const validateForm = (customerDetails: {
    name: string;
    email: string;
    contact1: string;
    address: string;
  }, cartItems: CartItem[]) => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.contact1 || !customerDetails.address) {
      alert("Please fill all the required fields.");
      return false;
    }
  
    if (!/^\d{10}$/.test(customerDetails.contact1)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }
  
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      return false;
    }
  
    return true;
  };