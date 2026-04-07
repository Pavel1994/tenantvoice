export default function Stars({ rating }: { rating: number }) {
  return (
    <div>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}