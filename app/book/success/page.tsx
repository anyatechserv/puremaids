export default function BookSuccessPage({ searchParams }: { searchParams: { ref?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
        {searchParams.ref && (
          <p className="mt-2 text-sm text-gray-500">Reference: <strong className="text-gray-900">{searchParams.ref}</strong></p>
        )}
        <p className="mt-3 text-gray-600">Your deposit has been received. We'll email a confirmation shortly.</p>
        <div className="mt-6 space-y-2">
          <a href="/" className="btn btn-md btn-primary w-full">Back to Home</a>
          <a href="/account/invoices" className="btn btn-md btn-secondary w-full">View My Invoices</a>
        </div>
      </div>
    </div>
  );
}
