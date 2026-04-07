"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export const dynamic = "force-dynamic";

export default function Page() {
  const supabase = getSupabase();
  const params = useParams();
  const address = decodeURIComponent(params.address as string);

  const [reviews, setReviews] = useState<any[]>([]);

  const handleLogin = async () => {
    const email = prompt("Enter your email");

    if(!email) return;

    await supabase.auth.signInWithOtp({
        email,
    });

    alert("Check your email!");
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /*useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);*/

  const handleLogout = async () => {
    await supabase.auth.signOut();
    //location.reload();
  }

  const fetchReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    //.ilike("address", `%${address}%`)
    .eq("address_normalized", address.toLowerCase().trim())
    .order("created_at", { ascending: false });

  if (!error && data) {
    setReviews(data);
  }
};

  useEffect(() => {
    fetchReviews();
  }, [address]);

  useEffect(() => {
    const channel = supabase
      .channel("review-realtime")
      .on(
        "postgres_changes",
         {
            event: "INSERT",
            schema: "public",
            table: "reviews",
         },
         (payload) => {
            const newReview = payload.new;

            //перевіряємо щоб тільки ця адреса
            if(
              newReview.address_normalized ===
              address.toLowerCase().trim()
            ) {
              setReviews((prev) => [newReview, ...prev]);
            }
         }
      )
      .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
  }, [address]);

  // ⭐ середній рейтинг
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0";

  // ⚠️ пошук проблем у тексті
  const issues = {
  mold: 0,
  cold: 0,
  noise: 0,
};

reviews.forEach((r) => {
  if (r.issues?.includes("mold")) issues.mold++;
  if (r.issues?.includes("cold")) issues.cold++;
  if (r.issues?.includes("noise")) issues.noise++;
});

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold">{address}</h1>

      <p className="text-sm text-slate-400 mt-4">Location</p>

      <div className="mt-6 w-full h-[200px] rounded-xl overflow-hidden">
        <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading= "lazy" 
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              address
            )}&output=embed`}
        ></iframe>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-slate-400">
              Logged in: {user.email}
            </span>

            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <span className="text-sm text-red-400">Not logged in</span>
        )}
      </div>
      
      {!user && (
        <button onClick={handleLogin} className="mt-4 bg-green-600 px-4 py-2 rounded">Login</button>
      )}

      {/* ⭐ рейтинг */}
      <div className="mt-4 flex items-center gap-4">
        <span className="text-2xl">⭐ {averageRating}</span>
        <span className="text-slate-400">
          ({reviews.length} reviews)
        </span>
      </div>

      {/* ⚠️ проблеми */}
      <div className="mt-4 flex gap-3 flex-wrap">
        {issues.mold > 0 && (
          <span className="bg-red-600 px-3 py-1 rounded">
            Mold ({issues.mold})
          </span>
        )}
        {issues.cold > 0 && (
          <span className="bg-blue-600 px-3 py-1 rounded">
            Cold ({issues.cold})
          </span>
        )}
        {issues.noise > 0 && (
          <span className="bg-yellow-600 px-3 py-1 rounded">
            Noise ({issues.noise})
          </span>
        )}
      </div>

      {/* форма */}
      <h2 className="text-xl font-semibold mt-6">Write a Review</h2>

      <div className="mt-3">
        <ReviewForm address={address} onSuccess={fetchReviews} />
      </div>

      {/* відгуки */}
      <h2 className="text-xl font-semibold mt-8">Reviews</h2>

      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} user={user} onDelete={fetchReviews} />
        ))}
      </div>
    </div>
  );
}
