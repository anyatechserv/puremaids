export default function SubscriptionCancel() {
  return (
    <div className="section py-20">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="heading-2 mb-4">Subscription Cancelled</h1>
        <p className="text-body mb-8">Your subscription setup was not completed. You can try again anytime.</p>
        <a href="/subscriptions" className="btn-primary">View Plans</a>
      </div>
    </div>
  );
}
