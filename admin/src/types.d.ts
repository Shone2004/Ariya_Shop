export interface ProductSize {
  value: string;
  available: boolean;
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  collection: string;
  description: string;
  image: string;
  hoverImage?: string;
  galleryImages: string[];
  price: number;
  originalPrice?: number;
  stockCount: number;
  lowStockAlert: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  occasion: string[];
  finish: string;
  estimatedDelivery: string;
  published: boolean;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  sizes?: ProductSize[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string | null;
}
