import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Cookie Policy', description: 'How PureMaids uses cookies and how to manage your preferences.' };

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-white pt-20">
        <div className="container max-w-3xl py-12">
          <h1 className="font-display text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>
          <div className="mt-8 prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900">What are cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help us provide you with a better experience.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">Cookies we use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Cookie</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'puremaids_consent', type: 'Necessary', purpose: 'Stores your cookie consent preferences', expiry: '1 year' },
                      { name: 'sb-auth-token', type: 'Necessary', purpose: 'Authentication session (Supabase)', expiry: 'Session' },
                      { name: '_ga', type: 'Analytics', purpose: 'Google Analytics visitor tracking', expiry: '2 years' },
                      { name: '_gid', type: 'Analytics', purpose: 'Google Analytics session tracking', expiry: '24 hours' },
                    ].map(c => (
                      <tr key={c.name}>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-xs">{c.name}</td>
                        <td className="border border-gray-200 px-4 py-2">{c.type}</td>
                        <td className="border border-gray-200 px-4 py-2">{c.purpose}</td>
                        <td className="border border-gray-200 px-4 py-2">{c.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">Managing cookies</h2>
              <p>You can change your cookie preferences at any time using the cookie banner (which reappears if you clear your browser data), or by clearing cookies in your browser settings.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
