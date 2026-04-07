"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ReviewFormProps } from "@/lib/types";

function normalizeAddress(address: string) {
  return address
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function ReviewForm({
  address,
  onSuccess,
}: ReviewFormProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const handleIssueChange = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please write a review");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must login first");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        address,
        address_normalized: normalizeAddress(address),
        content,
        rating,
        issues: selectedIssues,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setContent("");
    setRating(5);
    setSelectedIssues([]);
    await onSuccess?.();
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write review..."
        className="w-full rounded border border-slate-700 bg-slate-900 p-3 text-white"
      />

      <div className="mt-3 flex flex-wrap gap-4 text-white">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIssues.includes("cold")}
            onChange={() => handleIssueChange("cold")}
          />
          Cold
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIssues.includes("mold")}
            onChange={() => handleIssueChange("mold")}
          />
          Mold
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIssues.includes("noise")}
            onChange={() => handleIssueChange("noise")}
          />
          Noise
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded bg-slate-900 p-2 text-white"
        >
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>

        <button
          onClick={handleSubmit}
          className="rounded bg-green-600 px-4 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
