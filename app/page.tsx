"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import {useRouter } from "next/navigation";

type PlaceStats = {
  address: string;
  averageRating: number;
  reviewCount: number;
};

export default function Home() {
  const [worstPlaces, setWorstPlaces] = useState<PlaceStats[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWorstPlaces = async () => {
      const { data, error } = await supabase.from("reviews").select("*");

      if (error || !data) {
        console.error("Error loading reviews:", error);
        return;
      }

      const grouped: Record<
        string,
        { total: number; count: number }
      > = {};

      data.forEach((review) => {
        const key = review.address?.trim();
        if (!key) return;

        if (!grouped[key]) {
          grouped[key] = { total: 0, count: 0 };
        }

        grouped[key].total += review.rating;
        grouped[key].count += 1;
      });

      const places: PlaceStats[] = Object.entries(grouped).map(
        ([address, stats]) => ({
          address,
          averageRating: stats.total / stats.count,
          reviewCount: stats.count,
        })
      );

      places.sort((a, b) => {
        if (a.averageRating === b.averageRating) {
          return b.reviewCount - a.reviewCount;
        }
        return a.averageRating - b.averageRating;
      });

      setWorstPlaces(places.slice(0, 5));
    };

    fetchWorstPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-4">TenantVoice</h1>
          <p className="text-slate-400 mb-8">
            Find the truth before you rent
          </p>

          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Worst rated places
          </h2>

          {worstPlaces.length === 0 ? (
            <p className="text-slate-400">
              No data yet. Add more reviews to see trends.
            </p>
          ) : (
            <div className="space-y-4">
              {worstPlaces.map((place, index) => (
                <div
                  key={place.address}
                  onClick={() =>
                    router.push(
                      `/address/${encodeURIComponent(place.address)}`
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition"
                >
                  <div>
                    <p className="text-lg font-medium hover:underline">
                      {index + 1}. {place.address}
                    </p>
                    <p className="text-sm text-slate-400">
                      {place.reviewCount} reviews
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-semibold text-red-400">
                      ⭐ {place.averageRating.toFixed(1)}
                    </p>
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

/*"use client";

import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";

const handleLogin = async () => {
  const email = prompt("Enter your email");

  if(!email) return;

  await supabase.auth.signInWithOtp({
    email,
  });

  alert("Check your email");

  <button onClick={handleLogin} className="mb-4 bg-green-600 px-4 py-2 rounded">Login</button>
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">TenantVoice</h1>
      <p className="text-slate-400 mb-8">
        Find the truth before you rent
      </p>

      <div className="w-full max-w-2xl">
        <SearchBar />
      </div>
    </div>

    
  );
}*/