export default function SubscriptionCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Checkout Cancelled</h1>
        <p className="mt-2 text-gray-600">Your subscription was not started. No charge has been made.</p>
        <a href="/subscriptions" className="btn-primary mt-6">View Plans Again</a>
      </div>
    </div>
  );
}
