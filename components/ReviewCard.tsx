"use client";

import Stars from "./Stars";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import { useEffect, useState } from "react";

export default function ReviewCard({ review, user, onDelete }: any) {

  const [likes, setLikes] = useState<number>(review.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedIssues, setEditedIssues] = useState<string[]>(
    review.issues || []
  );

  const handleIssueChange = (issue: string) => {
      setEditedIssues((prev) =>
      prev.includes(issue)
      ? prev.filter((i) => i !== issue)
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
    
    if(error) {
      alert("Error: " + error.message);
    } else {
      setIsEditing(false);
      onDelete?.(); //просто перезавантажує список
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this review?");

    if(!confirmDelete) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if(error) {
      alert("Error: " + error.message);
    } else {
      onDelete?.(); //оновиться без перезагрузки сайта
    }
  };

  useEffect(() => {
  const checkLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("review_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("review_id", review.id)
      .single();

    if (data) {
      setIsLiked(true);
    }
  };

  checkLike();
}, [review.id]);

  useEffect(() => {
    const fetchLikes = async () => {
      const { count }= await supabase
      .from("review_likes")
      .select("*", { count: "exact", head: true })
      .eq("review_id", review.id);

      setLikes(count || 0);
    };

    fetchLikes();
  }, [review.id]);

    const handleLike = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if(!user) {
        alert("Login first!");
        return;
      }

      //перевіряємо чи вже лайкнув
      //const { data: existing } = await supabase
      if(isLiked) {
        //removelike
        await supabase
        .from("review_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("review_id", review.id);

        setLikes((prev) => prev - 1);
        setIsLiked(false);
        } else {
          //ще не лайкнув - додаємо
          await supabase.from("review_likes").insert([
            {
              user_id: user.id,
              review_id: review.id,
            },
          ]);

          setLikes((prev) => prev + 1);
          setIsLiked(true);
        }
  };
//<p className="mt-2 text-slate-300">{review.content}</p>
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <p className="text-sm text-slate-400">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-3">

          {/* TEXT */}
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />

          {/* RATING */}
          <select
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            className="bg-slate-900 p-2 rounded text-white"
          >
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* ISSUES */}
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

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 px-3 py-1 rounded text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>

        </div>
      ) : (
        <p className="mt-2 text-slate-300">{review.content}</p>
)}

      {review.issues && review.issues.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.issues.map((issue: string) => (
            <span
              key={issue}
              className="bg-slate-700 text-xs px-2 py-1 rounded text-white"
            >
              {issue}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-1">
        User: {review.user_id?.slice(0, 4)}***
      </p>

      {user && review.user_id === user.id && (
        <button
          onClick={handleDelete}
          className="mt-2 text-sm text-red-400 hover:text-red-300">🗑 Delete</button>
      )}

      {user && review.user_id === user.id && (
        <button 
          onClick={() => setIsEditing(true)}
          className="ml-3 text-sm text-blue-400 hover:text-blue-300">✏️ Edit</button>
      )}

      {/* 👍 ЛАЙКИ */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition ${
            isLiked
            ? "text-blue-400 scale-110"
            : "text-slate-400 hover:text-white"
            }`}>👍</button>
        <span className="text-sm text-slate-400">{likes}</span>
      </div>

    </div>
  );
}