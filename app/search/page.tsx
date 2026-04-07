import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
