import Link from "next/link";
import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";

export const metadata = {
  title: "Our Offices",
  description:
    "Visit EDUINTBD in Dhaka, Chittagong, and Sylhet for in-person counseling.",
};

const OFFICES = [
  {
    id: "dhaka-gulshan",
    city: "Dhaka",
    branch: "Gulshan (Head Office)",
    address: "House 32, Road 11, Gulshan-1, Dhaka 1212",
    phone: "+880 1700 000 001",
    email: "dhaka@eduintbd.com",
    hours: "Sat-Thu · 10:00 AM – 7:00 PM",
    lat: 23.7775,
    lng: 90.4151,
    featured: true,
  },
  {
    id: "dhaka-uttara",
    city: "Dhaka",
    branch: "Uttara Branch",
    address: "House 22, Road 7, Sector 4, Uttara, Dhaka 1230",
    phone: "+880 1700 000 002",
    email: "uttara@eduintbd.com",
    hours: "Sat-Thu · 10:00 AM – 7:00 PM",
    lat: 23.8759,
    lng: 90.3799,
    featured: false,
  },
  {
    id: "chittagong",
    city: "Chittagong",
    branch: "Agrabad",
    address: "4th Floor, 123 Agrabad Commercial Area, Chittagong",
    phone: "+880 1700 000 003",
    email: "ctg@eduintbd.com",
    hours: "Sat-Thu · 10:00 AM – 6:00 PM",
    lat: 22.3243,
    lng: 91.8076,
    featured: false,
  },
  {
    id: "sylhet",
    city: "Sylhet",
    branch: "Zindabazar",
    address: "2nd Floor, Zindabazar, Sylhet",
    phone: "+880 1700 000 004",
    email: "sylhet@eduintbd.com",
    hours: "Sat-Thu · 10:00 AM – 6:00 PM",
    lat: 24.8987,
    lng: 91.8687,
    featured: false,
  },
];

export default function OfficesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium mb-3">
          <MapPin className="h-3.5 w-3.5" /> Visit us in person
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Our offices</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Walk in for a free session, drop off originals, or attend a university
          info day. Bring your transcripts and passport.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OFFICES.map((o) => (
          <div
            key={o.id}
            className={`rounded-2xl border p-5 ${
              o.featured
                ? "border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-900/10"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  {o.city}
                </p>
                <h2 className="text-lg font-semibold">{o.branch}</h2>
              </div>
              {o.featured && (
                <span className="text-[10px] font-semibold text-blue-600">
                  Head Office
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {o.address}
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <a
                href={`tel:${o.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" /> {o.phone}
              </a>
              <a
                href={`mailto:${o.email}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" /> {o.email}
              </a>
              <p className="flex items-center gap-2 text-gray-500">
                <Clock className="h-3.5 w-3.5" /> {o.hours}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://www.openstreetmap.org/?mlat=${o.lat}&mlon=${o.lng}#map=17/${o.lat}/${o.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Open in map <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Get directions <ExternalLink className="h-3 w-3" />
              </a>
              <Link
                href="/book"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium"
              >
                Book a visit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
