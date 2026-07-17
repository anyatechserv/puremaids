export default function BookingCancel() {
  return (
    <div className="section py-20">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="heading-2 mb-4">Payment Cancelled</h1>
        <p className="text-body mb-8">Your booking was not completed. You can try again anytime.</p>
        <a href="/book" className="btn-primary">Try Again</a>
      </div>
    </div>
  );
}
