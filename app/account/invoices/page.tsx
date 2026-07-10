import InvoiceList from '@/components/stripe/InvoiceList';
import { BUSINESS } from '@/lib/constants';

export const metadata = {
  title: 'My Invoices | PureMaids',
  description: 'View and download your cleaning service invoices.',
};

export const dynamic = 'force-dynamic';

export default function InvoicesPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold text-brand-600">{BUSINESS.name}</a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
        <p className="mt-2 text-gray-600">Download or view all your cleaning service invoices.</p>
        <div className="mt-8">
          <InvoiceList />
        </div>
      </div>
    </div>
  );
}
