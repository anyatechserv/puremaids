interface StarsProps { rating: number; }

export default function Stars({ rating }: StarsProps) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>&#9733;</span>
      ))}
    </div>
  );
}
