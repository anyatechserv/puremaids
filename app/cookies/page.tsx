import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | PureMaids',
  description: 'PureMaids cookie policy. Learn how we use cookies on our website.',
};

export default function CookiesPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl text-secondary-800 mb-3">Cookie Policy</h1>
        <p className="text-secondary-400 text-sm mb-8">Last updated: 1 January 2024</p>
        <div className="space-y-6 text-secondary-600 leading-relaxed text-sm">
          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-2">What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owner.</p>
          </section>
          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-2">How We Use Cookies</h2>
            <p>PureMaids uses the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Strictly Necessary:</strong> Required for the website to function correctly.</li>
              <li><strong>Analytics:</strong> Help us understand how visitors use our site so we can improve it.</li>
              <li><strong>Marketing:</strong> Used to deliver relevant advertisements.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-2">Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Disabling cookies may affect the functionality of our website.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
