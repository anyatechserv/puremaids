export default function BookingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="mt-2 text-gray-600">Your booking payment was cancelled. No charge has been made.</p>
        <a href="/" className="btn-primary mt-6">Back to Home</a>
      </div>
    </div>
  );
}
