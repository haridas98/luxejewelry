// Основные типы данных для ювелирного магазина

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
  images?: ProductImage[];
  category: Category | number;
  subcategory?: Subcategory | number;
  brand?: number | null;
  brand_name?: string;
  metal?: string;
  metal_purity?: string;
  metal_display?: string;
  stones?: Stone[];
  material: string;
  weight?: number;
  dimensions?: string;
  stone_weight?: number;
  ring_size?: number | string;
  is_featured?: boolean;
  stone_type?: string;
  admin_info?: any;
  created_at: string;
  updated_at: string;
  stock_quantity?: number;
  is_out_of_stock?: boolean;
  subcategory_name?: string;
  category_name?: string;
  sets?: any[];
  article?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category: number;
}

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  image_url?: string;
  is_primary: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  slug?: string;
  products_count?: number;
}

export interface Stone {
  id: number;
  name: string;
  color?: string;
  description?: string;
  image?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_joined: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price?: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
  added_at: string;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
}

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  paymentMethod: 'card' | 'cash' | 'transfer';
}

// Типы для API ответов
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

// Типы для компонентов UI
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
}

// Типы для контекстов
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (itemId: number) => void;
  isInWishlist: (productId: number) => boolean;
}
