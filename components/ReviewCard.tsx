"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ReviewCardProps } from "@/lib/types";
import Stars from "./Stars";

export default function ReviewCard({
  review,
  user,
  onDelete,
}: ReviewCardProps) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedIssues, setEditedIssues] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadLikeState = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!isActive) return;

      if (!currentUser) {
        setIsLiked(false);
        return;
      }

      const { data } = await supabase
        .from("review_likes")
        .select("review_id")
        .eq("user_id", currentUser.id)
        .eq("review_id", review.id)
        .maybeSingle();

      if (isActive) {
        setIsLiked(Boolean(data));
      }
    };

    void loadLikeState();

    return () => {
      isActive = false;
    };
  }, [review.id]);

  useEffect(() => {
    let isActive = true;

    const loadLikes = async () => {
      const { count } = await supabase
        .from("review_likes")
        .select("*", { count: "exact", head: true })
        .eq("review_id", review.id);

      if (isActive) {
        setLikes(count || 0);
      }
    };

    void loadLikes();

    return () => {
      isActive = false;
    };
  }, [review.id]);

  const handleIssueChange = (issue: string) => {
    setEditedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue]
    );
  };

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      alert("Review cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .update({
        content: editedContent,
        rating: editedRating,
        issues: editedIssues,
      })
      .eq("id", review.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setIsEditing(false);
    await onDelete?.();
  };

  const handleStartEditing = () => {
    setEditedContent(review.content);
    setEditedRating(review.rating);
    setEditedIssues(review.issues || []);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this review?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("reviews").delete().eq("id", review.id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    await onDelete?.();
  };

  const handleLike = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      alert("Login first!");
      return;
    }

    if (isLiked) {
      await supabase
        .from("review_likes")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("review_id", review.id);

      setLikes((prev) => Math.max(prev - 1, 0));
      setIsLiked(false);
      return;
    }

    await supabase.from("review_likes").insert([
      {
        user_id: currentUser.id,
        review_id: review.id,
      },
    ]);

    setLikes((prev) => prev + 1);
    setIsLiked(true);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <p className="text-sm text-slate-400">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-white"
          />

          <select
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            className="rounded bg-slate-900 p-2 text-white"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <div className="flex gap-4 text-sm">
            {["cold", "mold", "noise"].map((issue) => (
              <label key={issue} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={editedIssues.includes(issue)}
                  onChange={() => handleIssueChange(issue)}
                />
                {issue}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="rounded bg-green-600 px-3 py-1 text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="rounded bg-gray-600 px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-slate-300">{review.content}</p>
      )}

      {review.issues.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.issues.map((issue) => (
            <span
              key={issue}
              className="rounded bg-slate-700 px-2 py-1 text-xs text-white"
            >
              {issue}
            </span>
          ))}
        </div>
      )}

      <p className="mt-1 text-xs text-slate-500">
        User: {review.user_id.slice(0, 4)}***
      </p>

      {user && review.user_id === user.id && (
        <div className="mt-2 flex gap-3">
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Delete
          </button>
          <button
            onClick={handleStartEditing}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`text-sm transition ${
            isLiked ? "scale-110 text-blue-400" : "text-slate-400 hover:text-white"
          }`}
        >
          Like
        </button>
        <span className="text-sm text-slate-400">{likes}</span>
      </div>
    </div>
  );
}
