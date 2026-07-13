export default function BookCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="mt-2 text-gray-600">No charge was made. Your booking hasn't been confirmed.</p>
        <div className="mt-6 space-y-2">
          <a href="/book" className="btn btn-md btn-primary w-full">Try Again</a>
          <a href="/" className="btn btn-md btn-secondary w-full">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
