"use client";

//import { supabase } from "@/lib/supabase";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!address.trim()) return;
    router.push(`/address/${encodeURIComponent(address)}`);
    //router.push(`/search?address=${address}`);
  };

  return (
    <div className="flex gap-2">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address..."
        className="flex-1 p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl"
      >
        Search
      </button>
    </div>
  );
}