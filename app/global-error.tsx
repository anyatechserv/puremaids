'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="section py-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="heading-2 mb-4">Something went wrong</h1>
            <p className="text-body mb-8">An unexpected error occurred. Please try again.</p>
            <button className="btn-primary" onClick={reset}>Try Again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
