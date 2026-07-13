import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
export const metadata = { title: 'Cookie Policy' };

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-white pt-20">
        <div className="container max-w-3xl py-12">
          <h1 className="font-display text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-1 text-sm text-gray-500">Last updated: January 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
            <section>
              <h2 className="text-lg font-bold text-gray-900">What are cookies?</h2>
              <p className="mt-2">Cookies are small text files placed on your device when you visit our website.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">Cookies we use</h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>{['Name','Type','Purpose','Expiry'].map(h => <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-gray-500">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'puremaids_gdpr', type: 'Necessary',  purpose: 'Stores your cookie consent preferences',    expiry: '1 year'    },
                      { name: 'sb-auth-token',  type: 'Necessary',  purpose: 'Supabase authentication session',           expiry: 'Session'   },
                      { name: '_ga',            type: 'Analytics',  purpose: 'Google Analytics visitor tracking',         expiry: '2 years'   },
                      { name: '_gid',           type: 'Analytics',  purpose: 'Google Analytics session data',             expiry: '24 hours'  },
                    ].map(c => (
                      <tr key={c.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono">{c.name}</td>
                        <td className="px-4 py-3">{c.type}</td>
                        <td className="px-4 py-3">{c.purpose}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{c.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">Managing cookies</h2>
              <p className="mt-2">Use the cookie banner to change preferences at any time, or clear cookies via your browser settings.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
