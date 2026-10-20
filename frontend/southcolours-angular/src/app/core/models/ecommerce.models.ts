export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive?: boolean;
  targetGender?: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  sizeName: string;
  colorName: string;
  colorHex?: string;
  availableStock: number;
  priceOverride?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  detailedDescription: string;
  originalPrice: number;
  sellingPrice: number;
  material?: string;
  fabricType?: string;
  gender: number;
  ageGroup?: string;
  careInstructions?: string;
  occasion?: string;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
  subCategory?: SubCategory;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText: string;
}

export interface CartItemModel {
  productId: string;
  productVariantId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
}

