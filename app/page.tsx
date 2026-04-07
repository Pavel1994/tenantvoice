"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getSupabase, hasSupabaseEnv } from "@/lib/supabase";
import type { PlaceStats, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function Home() {
  const [worstPlaces, setWorstPlaces] = useState<PlaceStats[]>([]);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let isActive = true;

    const fetchWorstPlaces = async () => {
      const { data, error } = await supabase.from("reviews").select("*");

      if (error || !data) {
        console.error("Error loading reviews:", error);
        return;
      }

      const grouped: Record<string, { total: number; count: number }> = {};

      data.forEach((review: Review) => {
        const key = review.address.trim();
        if (!key) return;

        if (!grouped[key]) {
          grouped[key] = { total: 0, count: 0 };
        }

        grouped[key].total += review.rating;
        grouped[key].count += 1;
      });

      const places = Object.entries(grouped)
        .map(([address, stats]) => ({
          address,
          averageRating: stats.total / stats.count,
          reviewCount: stats.count,
        }))
        .sort((a, b) => {
          if (a.averageRating === b.averageRating) {
            return b.reviewCount - a.reviewCount;
          }

          return a.averageRating - b.averageRating;
        })
        .slice(0, 5);

      if (isActive) {
        setWorstPlaces(places);
      }
    };

    void fetchWorstPlaces();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-4 text-5xl font-bold">TenantVoice</h1>
          <p className="mb-8 text-slate-400">Find the truth before you rent</p>

          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="mt-16 w-full">
          <h2 className="mb-4 text-2xl font-semibold">Worst rated places</h2>

          {!hasSupabaseEnv ? (
            <p className="text-red-400">
              Supabase is not configured. Add `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
            </p>
          ) : worstPlaces.length === 0 ? (
            <p className="text-slate-400">No data yet. Add more reviews to see trends.</p>
          ) : (
            <div className="space-y-4">
              {worstPlaces.map((place, index) => (
                <div
                  key={place.address}
                  onClick={() =>
                    router.push(`/address/${encodeURIComponent(place.address)}`)
                  }
                  className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-4 transition hover:bg-slate-700"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium hover:underline">
                        {index + 1}. {place.address}
                      </p>
                      <p className="text-sm text-slate-400">{place.reviewCount} reviews</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-semibold text-red-400">
                        {place.averageRating.toFixed(1)} / 5
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
