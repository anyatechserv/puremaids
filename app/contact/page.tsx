import type { Metadata } from 'next';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: 'Contact PureMaids | Get in Touch | Cleaning Services London',
  description:
    'Contact PureMaids for professional cleaning services in London. Get a free quote, ask questions, or book your clean. We respond within 2 business hours.',
};

export default function ContactPage() {
  return <ContactForm />;
}
