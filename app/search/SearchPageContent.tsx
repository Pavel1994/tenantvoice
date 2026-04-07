"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/types";

function normalizeAddress(address: string) {
  return address
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!address) return;

    let isActive = true;

    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("address_normalized", normalizeAddress(address))
        .order("created_at", { ascending: false });

      if (isActive && data) {
        setReviews(data as Review[]);
      }
    };

    void fetchReviews();

    return () => {
      isActive = false;
    };
  }, [address]);

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">{address}</h1>

      <div className="mb-6">
        <ReviewForm address={address} />
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
