"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

function normalizeAddress(address: string) {
  return address
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function AddressPage() {
  const params = useParams<{ address: string }>();
  const address = decodeURIComponent(params.address);
  const normalizedAddress = useMemo(() => normalizeAddress(address), [address]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (isActive) {
        setUser(currentUser);
      }
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isActive) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("address_normalized", normalizedAddress)
        .order("created_at", { ascending: false });

      if (!error && data && isActive) {
        setReviews(data as Review[]);
      }
    };

    void loadReviews();

    return () => {
      isActive = false;
    };
  }, [normalizedAddress]);

  useEffect(() => {
    const channel = supabase
      .channel(`reviews:${normalizedAddress}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        () => {
          void supabase
            .from("reviews")
            .select("*")
            .eq("address_normalized", normalizedAddress)
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
              if (!error && data) {
                setReviews(data as Review[]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [normalizedAddress]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const issues = reviews.reduce(
    (acc, review) => {
      if (review.issues?.includes("mold")) acc.mold += 1;
      if (review.issues?.includes("cold")) acc.cold += 1;
      if (review.issues?.includes("noise")) acc.noise += 1;
      return acc;
    },
    { mold: 0, cold: 0, noise: 0 }
  );

  const refreshReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("address_normalized", normalizedAddress)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as Review[]);
    }
  };

  const handleLogin = async () => {
    const email = prompt("Enter your email");

    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email!");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-white">
      <h1 className="text-4xl font-bold">{address}</h1>

      <p className="mt-4 text-sm text-slate-400">Location</p>

      <div className="mt-6 h-[200px] w-full overflow-hidden rounded-xl">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-400">Logged in: {user.email}</span>
            <button onClick={handleLogout} className="rounded bg-red-600 px-3 py-1">
              Logout
            </button>
          </>
        ) : (
          <>
            <span className="text-sm text-red-400">Not logged in</span>
            <button onClick={handleLogin} className="rounded bg-green-600 px-4 py-2">
              Login
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-2xl">? {averageRating}</span>
        <span className="text-slate-400">({reviews.length} reviews)</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {issues.mold > 0 && <span className="rounded bg-red-600 px-3 py-1">Mold ({issues.mold})</span>}
        {issues.cold > 0 && <span className="rounded bg-blue-600 px-3 py-1">Cold ({issues.cold})</span>}
        {issues.noise > 0 && <span className="rounded bg-yellow-600 px-3 py-1">Noise ({issues.noise})</span>}
      </div>

      <h2 className="mt-6 text-xl font-semibold">Write a Review</h2>

      <div className="mt-3">
        <ReviewForm address={address} onSuccess={refreshReviews} />
      </div>

      <h2 className="mt-8 text-xl font-semibold">Reviews</h2>

      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            user={user}
            onDelete={refreshReviews}
          />
        ))}
      </div>
    </div>
  );
}
