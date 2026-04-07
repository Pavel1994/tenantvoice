"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export default function SearchPageContent() {
  const supabase = getSupabase();
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";

  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    if (!address) return;

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("address", address);

    if (data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [address]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">{address}</h1>

      <div className="mb-6">
        <ReviewForm address={address} />
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
}