import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Frequently asked questions, delivery times, and our returns policy.",
  alternates: { canonical: "/support" },
};

const FAQS = [
  {
    question: "Do you have a physical store?",
    answer: "We currently operate primarily online.",
  },
  {
    question: "Do you offer pickup?",
    answer: "Yes. Orders can be picked up in Oriokuta, Ogijo.",
  },
  {
    question: "When can I pick up my order?",
    answer: "Immediately after payment has been confirmed.",
  },
  {
    question: "How do I know my size?",
    answer: "Detailed sizing information is included on every product page.",
  },
  {
    question: "Can I return an item?",
    answer: "Yes. Eligible items may be returned within 24 hours.",
  },
];

const DELIVERY_TIMES = [
  { destination: "Ogun State", timeline: "1–3 business days" },
  { destination: "Lagos State", timeline: "1–3 business days" },
  { destination: "Other locations", timeline: "3–7 business days" },
];

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">Support</h1>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-espresso">FAQ</h2>
        <div className="mt-6 flex flex-col divide-y divide-cocoa/15">
          {FAQS.map((faq) => (
            <div key={faq.question} className="py-5">
              <p className="font-display text-lg text-espresso">{faq.question}</p>
              <p className="mt-2 font-sans text-base text-espresso/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-espresso">Delivery</h2>
        <p className="mt-4 font-sans text-base text-espresso/70">
          We currently deliver across Nigeria.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-cocoa/15">
          <table className="w-full font-sans text-left">
            <thead>
              <tr className="border-b border-cocoa/15 bg-cream text-sm uppercase tracking-widest text-cocoa">
                <th className="px-5 py-3">Destination</th>
                <th className="px-5 py-3">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {DELIVERY_TIMES.map((row) => (
                <tr key={row.destination} className="border-b border-cocoa/10 last:border-0">
                  <td className="px-5 py-3 text-espresso">{row.destination}</td>
                  <td className="px-5 py-3 text-espresso/70">{row.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-espresso">Returns</h2>
        <p className="mt-4 font-sans text-base text-espresso/70">
          Items are eligible for return if they are:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 font-sans text-base text-espresso/70">
          <li>Unworn</li>
          <li>Unwashed</li>
          <li>In their original condition</li>
          <li>Returned within 24 hours</li>
        </ul>
        <p className="mt-6 font-sans text-base text-espresso/70">
          Customers are responsible for return shipping costs when the
          return results from customer error.
        </p>
      </section>
    </div>
  );
}
