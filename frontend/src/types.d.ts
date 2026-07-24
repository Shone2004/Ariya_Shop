export interface ProductSize {
  value: string;
  available: boolean;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  collection: string;
  image: string;
  hoverImage?: string;
  galleryImages: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stockCount: number;
  lowStockAlert?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  finish: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  sizes?: ProductSize[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string | null;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string | null;
}
