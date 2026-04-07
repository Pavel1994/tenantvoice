import dynamic from "next/dynamic";

const SearchPage = dynamic(() => import("./SearchPageContent"), {
  ssr: false,
});

export default function Page() {
  return <SearchPage />;
}

/*"use client";

import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}*/

//import { useSearchParams } from "next/navigation";
//import { useEffect, useState } from "react";
/*import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm"; 

export const dynamic = "force-dynamic";*/

/*export default function Page() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("address", address);

    if (data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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

      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}*/