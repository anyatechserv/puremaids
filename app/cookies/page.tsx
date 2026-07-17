export default function CookiesPage() {
  return (
    <div className="section py-16">
      <div className="mx-auto max-w-3xl prose">
        <h1 className="heading-1 mb-8">Cookie Policy</h1>
        <div className="space-y-6 text-gray-600">
          <section><h2 className="heading-3 mb-3">Essential Cookies</h2><p>These are necessary for the website to function. They include authentication session tokens and security cookies. These cannot be disabled.</p></section>
          <section><h2 className="heading-3 mb-3">Analytics Cookies</h2><p>We use analytics cookies to understand how visitors use our website. These are disabled by default and only enabled with your consent.</p></section>
          <section><h2 className="heading-3 mb-3">Marketing Cookies</h2><p>Marketing cookies are used to show relevant ads. These are disabled by default and only enabled with your consent.</p></section>
          <section><h2 className="heading-3 mb-3">Managing Cookies</h2><p>You can manage your cookie preferences using the cookie banner at the bottom of the page. You can also clear cookies in your browser settings.</p></section>
        </div>
      </div>
    </div>
  );
}
