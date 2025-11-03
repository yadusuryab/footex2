import { useState } from 'react';
import Image from 'next/image';

interface Shoe {
  _id: string;
  productName: string;
  orderNumber: number;
  images: Array<{
    asset: {
      url: string;
    };
  }>;
  price: number;
  // ... other properties
}

interface SelectPageProps {
  shoes: Shoe[];
}

export default function SelectPageComponent({ shoes }: SelectPageProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());

  const toggleProductSelection = (orderNumber: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(orderNumber)) {
      newSelected.delete(orderNumber);
    } else {
      newSelected.add(orderNumber);
    }
    setSelectedProducts(newSelected);
  };

  const shareSelectedProducts = () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }

    const orderNumbers = Array.from(selectedProducts)
      .sort((a, b) => a - b)
      .map(num => `"${num}"`)
      .join(',');

    const message = orderNumbers;

    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: 'Selected Products',
        text: message,
      }).catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message)
        .then(() => alert('Order numbers copied to clipboard!'))
        .catch(err => {
          console.error('Failed to copy: ', err);
          // Alternative fallback
          const textArea = document.createElement('textarea');
          textArea.value = message;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Order numbers copied to clipboard!');
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Select Products</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Selected: {selectedProducts.size} products
          </span>
          <button
            onClick={shareSelectedProducts}
            disabled={selectedProducts.size === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedProducts.size === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Share Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shoes.map((shoe) => (
          <div
            key={shoe._id}
            className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedProducts.has(shoe.orderNumber)
                ? 'ring-2 ring-blue-500 border-blue-500'
                : 'border-gray-200 hover:shadow-lg'
            }`}
            onClick={() => toggleProductSelection(shoe.orderNumber)}
          >
            {/* Order Number Badge */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
              #{shoe.orderNumber}
            </div>

            {/* Product Image */}
            <div className="relative h-64 w-full">
              {shoe.images?.[0]?.asset?.url ? (
                <Image
                  src={shoe.images[0].asset.url}
                  alt={shoe.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedProducts.has(shoe.orderNumber)
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedProducts.has(shoe.orderNumber) && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">{shoe.productName}</h3>
              <p className="text-gray-600">${shoe.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Share Button for Mobile */}
      {selectedProducts.size > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4">
          <button
            onClick={shareSelectedProducts}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-lg"
          >
            Share {selectedProducts.size} Selected Product{selectedProducts.size > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}