import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="section py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-white mb-2">PureMaids</p>
            <p className="text-sm">Professional cleaning services in Bolton and Greater Manchester.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Services</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/book?service=domestic" className="hover:text-brand-400">Domestic Cleaning</Link></li>
              <li><Link href="/book?service=deep" className="hover:text-brand-400">Deep Cleaning</Link></li>
              <li><Link href="/book?service=end_of_tenancy" className="hover:text-brand-400">End of Tenancy</Link></li>
              <li><Link href="/book?service=office" className="hover:text-brand-400">Office Cleaning</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-brand-400">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400">Terms</Link></li>
              <li><Link href="/cookies" className="hover:text-brand-400">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Trust</p>
            <ul className="space-y-2 text-sm">
              <li>DBS-Checked Cleaners</li>
              <li>£2M Public Liability</li>
              <li>Satisfaction Guarantee</li>
              <li>GDPR Compliant</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PureMaids Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
