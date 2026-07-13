export default function SubCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900">Checkout Cancelled</h1>
        <p className="mt-2 text-gray-600">No subscription was started and no charge was made.</p>
        <a href="/subscriptions" className="btn btn-md btn-primary mt-6 w-full">View Plans Again</a>
      </div>
    </div>
  );
}
