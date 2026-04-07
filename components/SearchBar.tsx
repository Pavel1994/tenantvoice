"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const normalizedAddress = address.trim();

    if (!normalizedAddress) return;

    router.push(`/address/${encodeURIComponent(normalizedAddress)}`);
  };

  return (
    <div className="flex gap-2">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address..."
        className="flex-1 rounded-xl border border-slate-700 bg-slate-800 p-4 text-white"
      />
      <button
        onClick={handleSearch}
        className="rounded-xl bg-blue-600 px-6 hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
