import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cleaning Services Bolton, Manchester, Bury, Wigan & Preston | PureMaids',
  description:
    'PureMaids provides professional house cleaning across Bolton, Manchester, Bury, Wigan, Preston, Chorley, Salford and 30+ North West towns. Check if we cover your area.',
  keywords: [
    'house cleaning Bolton', 'cleaning services Manchester', 'domestic cleaning Bury',
    'cleaning services Wigan', 'cleaning services Preston', 'cleaning services Chorley',
    'cleaning services Salford', 'domestic cleaners near me', 'cleaning company Greater Manchester',
  ],
  alternates: { canonical: 'https://puremaids.co.uk/areas' },
};

const areaGroups = [
  {
    region: 'Bolton',
    tagline: 'House cleaning across all BL postcodes',
    areas: [
      { name: 'Bolton Town Centre', postcode: 'BL1', keywords: 'house cleaning Bolton BL1' },
      { name: 'Farnworth', postcode: 'BL4', keywords: 'domestic cleaning Farnworth' },
      { name: 'Horwich', postcode: 'BL6', keywords: 'house cleaning Horwich' },
      { name: 'Westhoughton', postcode: 'BL5', keywords: 'domestic cleaning Westhoughton' },
      { name: 'Kearsley', postcode: 'BL4', keywords: 'cleaners Kearsley Bolton' },
      { name: 'Little Lever', postcode: 'BL3', keywords: 'house cleaning Little Lever' },
      { name: 'Bromley Cross', postcode: 'BL7', keywords: 'cleaning services Bromley Cross' },
      { name: 'Heaton', postcode: 'BL1', keywords: 'domestic cleaning Heaton Bolton' },
    ],
    description: 'Our Bolton cleaning team covers the entire BL postcode area. As a Bolton-based business, we understand the local area and can usually assign a cleaner within 24 hours.',
    color: 'border-primary-200 bg-primary-50',
    accent: 'text-primary-600 bg-primary-100',
  },
  {
    region: 'Manchester',
    tagline: 'Professional cleaning across Manchester',
    areas: [
      { name: 'Manchester City Centre', postcode: 'M1–M4', keywords: 'house cleaning Manchester city' },
      { name: 'Salford', postcode: 'M5–M7', keywords: 'domestic cleaning Salford' },
      { name: 'Eccles', postcode: 'M30', keywords: 'cleaning services Eccles' },
      { name: 'Stretford', postcode: 'M32', keywords: 'house cleaning Stretford' },
      { name: 'Worsley', postcode: 'M28', keywords: 'domestic cleaners Worsley' },
      { name: 'Walkden', postcode: 'M28', keywords: 'cleaning services Walkden' },
      { name: 'Swinton', postcode: 'M27', keywords: 'house cleaning Swinton Salford' },
      { name: 'Irlam', postcode: 'M44', keywords: 'domestic cleaning Irlam' },
    ],
    description: 'From Manchester city centre to Salford and the surrounding Greater Manchester area, PureMaids provides reliable domestic, deep and commercial cleaning throughout.',
    color: 'border-blue-200 bg-blue-50',
    accent: 'text-blue-700 bg-blue-100',
  },
  {
    region: 'Bury',
    tagline: 'Domestic & deep cleaning across Bury',
    areas: [
      { name: 'Bury Town Centre', postcode: 'BL9', keywords: 'house cleaning Bury BL9' },
      { name: 'Radcliffe', postcode: 'BL2/M26', keywords: 'domestic cleaning Radcliffe' },
      { name: 'Ramsbottom', postcode: 'BL0', keywords: 'cleaning services Ramsbottom' },
      { name: 'Heywood', postcode: 'OL10', keywords: 'house cleaning Heywood Bury' },
      { name: 'Tottington', postcode: 'BL8', keywords: 'cleaners Tottington Bury' },
      { name: 'Whitefield', postcode: 'M45', keywords: 'domestic cleaning Whitefield' },
      { name: 'Prestwich', postcode: 'M25', keywords: 'house cleaning Prestwich' },
      { name: 'Unsworth', postcode: 'BL9', keywords: 'cleaning services Unsworth' },
    ],
    description: 'PureMaids serves the whole of Bury borough, from the town centre to Ramsbottom, Radcliffe and Whitefield. End of tenancy and domestic cleaning are our most requested services here.',
    color: 'border-green-200 bg-green-50',
    accent: 'text-green-700 bg-green-100',
  },
  {
    region: 'Wigan',
    tagline: 'House & commercial cleaning in Wigan',
    areas: [
      { name: 'Wigan Town Centre', postcode: 'WN1', keywords: 'house cleaning Wigan WN1' },
      { name: 'Leigh', postcode: 'WN7', keywords: 'domestic cleaning Leigh Wigan' },
      { name: 'Atherton', postcode: 'M46', keywords: 'cleaning services Atherton' },
      { name: 'Tyldesley', postcode: 'M29', keywords: 'house cleaning Tyldesley' },
      { name: 'Hindley', postcode: 'WN2', keywords: 'domestic cleaners Hindley Wigan' },
      { name: 'Ashton-in-Makerfield', postcode: 'WN4', keywords: 'cleaning Ashton Makerfield' },
      { name: 'Golborne', postcode: 'WA3', keywords: 'house cleaning Golborne' },
      { name: 'Standish', postcode: 'WN6', keywords: 'domestic cleaning Standish' },
    ],
    description: 'Covering Wigan and all surrounding WN postcodes. Our Wigan customers particularly use our end of tenancy cleaning and regular domestic cleaning services.',
    color: 'border-amber-200 bg-amber-50',
    accent: 'text-amber-700 bg-amber-100',
  },
  {
    region: 'Preston',
    tagline: 'Cleaning services across Preston & Chorley',
    areas: [
      { name: 'Preston City Centre', postcode: 'PR1', keywords: 'house cleaning Preston PR1' },
      { name: 'Chorley', postcode: 'PR7', keywords: 'domestic cleaning Chorley' },
      { name: 'Leyland', postcode: 'PR25', keywords: 'cleaning services Leyland Preston' },
      { name: 'Bamber Bridge', postcode: 'PR5', keywords: 'house cleaning Bamber Bridge' },
      { name: 'Penwortham', postcode: 'PR1', keywords: 'domestic cleaners Penwortham' },
      { name: 'Fulwood', postcode: 'PR2', keywords: 'house cleaning Fulwood Preston' },
      { name: 'Longridge', postcode: 'PR3', keywords: 'cleaning services Longridge' },
      { name: 'Adlington', postcode: 'PR7', keywords: 'domestic cleaning Adlington Chorley' },
    ],
    description: 'From Preston city centre to Chorley, Leyland and surrounding PR postcodes, PureMaids brings the same high standards to South Lancashire that our Bolton customers love.',
    color: 'border-violet-200 bg-violet-50',
    accent: 'text-violet-700 bg-violet-100',
  },
  {
    region: 'North West',
    tagline: 'Across Lancashire & Greater Manchester',
    areas: [
      { name: 'Blackburn', postcode: 'BB1–BB2', keywords: 'house cleaning Blackburn' },
      { name: 'Burnley', postcode: 'BB10–BB12', keywords: 'domestic cleaning Burnley' },
      { name: 'Rochdale', postcode: 'OL11–OL16', keywords: 'cleaning services Rochdale' },
      { name: 'Oldham', postcode: 'OL1–OL9', keywords: 'house cleaning Oldham' },
      { name: 'Stockport', postcode: 'SK1–SK4', keywords: 'domestic cleaning Stockport' },
      { name: 'Skelmersdale', postcode: 'WN8', keywords: 'cleaning services Skelmersdale' },
      { name: 'Darwen', postcode: 'BB3', keywords: 'house cleaning Darwen Blackburn' },
      { name: 'Accrington', postcode: 'BB5', keywords: 'domestic cleaners Accrington' },
    ],
    description: 'Our reach extends across the wider North West — from Blackburn and Burnley in Lancashire to Rochdale, Oldham and Stockport in Greater Manchester.',
    color: 'border-secondary-200 bg-secondary-50',
    accent: 'text-secondary-700 bg-secondary-100',
  },
];

const localSeoContent = [
  {
    city: 'Bolton',
    content: 'Bolton is our home. PureMaids was founded in Bolton and our core team of cleaners lives and works right here. We know the town — from Victorian terraces in BL1 to new-builds in Horwich and Westhoughton. Whether you need a weekly domestic clean, a pre-sale deep clean, or an end of tenancy service before leaving your rented property, we\'re your local Bolton cleaning company.',
  },
  {
    city: 'Manchester',
    content: 'Manchester\'s rental market is booming, and so is demand for end of tenancy cleaning. Our Manchester team handles everything from city-centre apartments in M1–M4 to family homes in Salford and Eccles. With after-hours scheduling available, our commercial cleaning is also popular with Manchester offices.',
  },
  {
    city: 'Bury',
    content: 'Bury customers love our regular domestic cleaning service. Many of our Bury clients have been with us for years, benefiting from the same dedicated cleaner who knows their home and family. We cover the whole of BL9, BL8, BL0 and surrounding areas.',
  },
  {
    city: 'Wigan',
    content: 'Wigan\'s mix of Victorian terraces and modern estates keeps our Wigan team busy with a range of services. End of tenancy cleaning is particularly popular in Leigh and Atherton where there\'s a large rental market. We cover all WN postcodes.',
  },
  {
    city: 'Preston',
    content: 'Preston and Chorley customers benefit from the same award-winning service as our Bolton base. The Preston student market means end of tenancy cleaning demand is high from June–September. Early booking is recommended for summer slots.',
  },
];

export default function AreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary-400" />
            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">30+ Towns Covered</span>
          </div>
          <h1 className="font-heading mb-5 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Cleaning Services Across<br />
            <span className="text-primary-400">Bolton &amp; the North West</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-300 leading-relaxed">
            Bolton, Manchester, Bury, Wigan and Preston — plus 30+ surrounding towns across Lancashire and Greater Manchester. Find your area below or enter your postcode to get an instant quote.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-400">
              Check My Postcode
            </Link>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl border border-secondary-600 px-7 py-3.5 text-sm font-bold text-secondary-200 transition-all hover:border-secondary-400 hover:text-white">
              <Phone className="h-4 w-4" /> {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Area grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-3 text-3xl font-extrabold text-secondary-800 md:text-4xl">
              Areas We Cover
            </h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              Click any area to see availability and get a quote. Don&apos;t see your town? Call us — we may still cover it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {areaGroups.map((group) => (
              <div key={group.region} className={`rounded-3xl border p-6 ${group.color}`}>
                <div className="mb-4">
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-2 ${group.accent}`}>
                    <MapPin className="h-3 w-3" /> {group.region}
                  </div>
                  <h3 className="font-heading font-bold text-secondary-800 text-lg">{group.tagline}</h3>
                  <p className="text-xs text-secondary-500 mt-1 leading-relaxed">{group.description}</p>
                </div>
                <ul className="grid grid-cols-2 gap-1.5">
                  {group.areas.map((area) => (
                    <li key={area.name}>
                      <Link href="/book-online"
                        className="flex items-center gap-1.5 text-xs text-secondary-600 hover:text-primary-600 transition-colors py-0.5 group">
                        <CheckCircle className="h-3 w-3 text-secondary-300 group-hover:text-primary-400 shrink-0" />
                        <span>{area.name}</span>
                        <span className="text-secondary-300 text-[10px]">{area.postcode}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO copy */}
      <section className="bg-secondary-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading mb-3 text-center text-3xl font-extrabold text-secondary-800 md:text-4xl">
            Local Cleaning Services — Your Area, Your Team
          </h2>
          <p className="mb-12 text-center text-secondary-500">
            We don&apos;t just cover the North West — we&apos;re part of it. Local cleaners, local knowledge, local reliability.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {localSeoContent.map(({ city, content }) => (
              <div key={city} className="rounded-2xl border border-secondary-100 bg-white p-6 shadow-soft">
                <h3 className="font-heading font-bold text-secondary-800 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-500" /> Cleaning in {city}
                </h3>
                <p className="text-sm text-secondary-600 leading-relaxed">{content}</p>
                <Link href="/book-online"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700">
                  Book in {city} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not listed */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-3xl border border-secondary-100 bg-white p-10 shadow-medium">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <MapPin className="h-6 w-6 text-primary-500" />
            </div>
            <h2 className="font-heading mb-3 text-2xl font-extrabold text-secondary-800">
              Don&apos;t See Your Town?
            </h2>
            <p className="mb-6 text-secondary-500 leading-relaxed">
              We cover 30+ towns across the North West and are always expanding. Contact us with your postcode and we&apos;ll confirm coverage within the hour.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/book-online"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-600">
                Check My Postcode
              </Link>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 px-6 py-3 text-sm font-bold text-secondary-700 transition-all hover:bg-secondary-50">
                <Phone className="h-4 w-4" /> Call Us Free
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
