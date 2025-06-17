export interface ProductImage {
  url: string
  alt: string
  isPrimary: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  longDescription?: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  images: ProductImage[]
  features: string[]
  specifications: Record<string, string>
  stock: number
  rating: number
  reviewCount: number
  featured: boolean
  isActive: boolean
  tags: string[]
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  warranty?: {
    duration: number
    unit: string
    description: string
  }
  seoTitle?: string
  seoDescription?: string
  seoKeywords: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  category: string
  brand: string
  minPrice: number
  maxPrice: number
  rating: number
  inStock: boolean
  featured: boolean
  search: string
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
  filters: {
    categories: string[]
    brands: string[]
  }
}
