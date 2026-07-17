export default function SubscriptionSuccess() {
  return (
    <div className="section py-20">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 text-6xl">&#10003;</div>
        <h1 className="heading-2 mb-4">Subscription Active!</h1>
        <p className="text-body mb-8">Your subscription is now active. We'll be in touch to schedule your first clean.</p>
        <a href="/account" className="btn-primary">View Account</a>
      </div>
    </div>
  );
}
