import type { User } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Review = {
  id: number;
  address: string;
  address_normalized: string;
  content: string;
  rating: number;
  issues: string[];
  user_id: string;
  created_at: string;
};

export type PlaceStats = {
  address: string;
  averageRating: number;
  reviewCount: number;
};

export type ReviewFormProps = {
  address: string;
  onSuccess?: () => void | Promise<void>;
};

export type ReviewCardProps = {
  review: Review;
  user?: User | null;
  onDelete?: () => void | Promise<void>;
};

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: Review;
        Insert: {
          id?: number;
          address: string;
          address_normalized: string;
          content: string;
          rating: number;
          issues?: string[];
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          address?: string;
          address_normalized?: string;
          content?: string;
          rating?: number;
          issues?: string[];
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      review_likes: {
        Row: {
          id: number;
          user_id: string;
          review_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          review_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          review_id?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
