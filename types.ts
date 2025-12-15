
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  userReviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  street?: string;
  city?: string;
  phone?: string;
  loyaltyPoints?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  discount?: number;
  date: string;
  deliveryDate: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  address: string;
  pointsEarned?: number;
}

export interface AddressInfo {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}
