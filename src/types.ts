// src/types.ts

export interface UserProfile {
  role: 'BUYER' | 'SELLER';
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}


export interface Product {
  id: number;
  title: string;
  description?: string;
  unit_price: number;
  available_quantity?: number;
  image?: string;
}