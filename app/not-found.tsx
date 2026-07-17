import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="heading-3 mb-4">Page Not Found</h2>
        <p className="text-body mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );
}
