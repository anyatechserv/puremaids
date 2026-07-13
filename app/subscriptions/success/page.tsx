export default function SubSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card p-8 text-center max-w-md w-full">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
          <svg className="h-8 w-8 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Subscription Activated!</h1>
        <p className="mt-2 text-gray-600">Your cleaning plan is active. We'll be in touch to schedule your first visit.</p>
        <a href="/" className="btn btn-md btn-primary mt-6 w-full">Back to Home</a>
      </div>
    </div>
  );
}
