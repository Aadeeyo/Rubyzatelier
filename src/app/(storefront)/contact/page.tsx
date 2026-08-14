import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { BUSINESS_PHONE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Rubyzatelier — sizing, delivery, pickup, and order questions.",
  alternates: { canonical: "/contact" },
};

// TODO: swap this for the founder's real contact email once available -
// BUSINESS_PHONE and the social handles below are confirmed real values.
const CONTACT_EMAIL = "hello@rubyzatelier.com";
const SOCIAL_HANDLE = "@shoprubzatelier";

const HOURS = [
  { day: "Monday–Friday", hours: "9:00 AM–6:00 PM" },
  { day: "Saturday", hours: "10:00 AM–4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactPage() {
  const whatsappNumber = BUSINESS_PHONE.replace(/[^0-9]/g, "");

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">
        We&apos;d love to hear from you.
      </h1>
      <p className="mt-4 max-w-xl font-sans text-lg text-espresso/70">
        Whether you have questions about sizing, delivery, pickup, or an
        existing order, we&apos;re here to help.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-espresso">Contact Channels</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl bg-cream p-6 text-center transition-colors hover:bg-sand/40"
          >
            <MessageCircle className="text-terracotta" size={28} />
            <p className="font-display text-lg text-espresso">WhatsApp</p>
            <p className="font-sans text-sm text-espresso/60">{BUSINESS_PHONE}</p>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex flex-col items-center gap-2 rounded-xl bg-cream p-6 text-center transition-colors hover:bg-sand/40"
          >
            <Mail className="text-terracotta" size={28} />
            <p className="font-display text-lg text-espresso">Email</p>
            <p className="font-sans text-sm text-espresso/60">{CONTACT_EMAIL}</p>
          </a>
          <a
            href="https://instagram.com/shoprubzatelier"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl bg-cream p-6 text-center transition-colors hover:bg-sand/40"
          >
            <InstagramIcon className="text-terracotta" size={28} />
            <p className="font-display text-lg text-espresso">Instagram</p>
            <p className="font-sans text-sm text-espresso/60">{SOCIAL_HANDLE}</p>
          </a>
          <a
            href="https://www.tiktok.com/@shoprubzatelier"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl bg-cream p-6 text-center transition-colors hover:bg-sand/40"
          >
            <TikTokIcon className="text-terracotta" size={28} />
            <p className="font-display text-lg text-espresso">TikTok</p>
            <p className="font-sans text-sm text-espresso/60">{SOCIAL_HANDLE}</p>
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-espresso">Customer Service Hours</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-cocoa/15">
          <table className="w-full font-sans text-left">
            <thead>
              <tr className="border-b border-cocoa/15 bg-cream text-sm uppercase tracking-widest text-cocoa">
                <th className="px-5 py-3">Day</th>
                <th className="px-5 py-3">Hours</th>
              </tr>
            </thead>
            <tbody>
              {HOURS.map((row) => (
                <tr key={row.day} className="border-b border-cocoa/10 last:border-0">
                  <td className="px-5 py-3 text-espresso">{row.day}</td>
                  <td className="px-5 py-3 text-espresso/70">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
