import type { User } from "@supabase/supabase-js";

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
