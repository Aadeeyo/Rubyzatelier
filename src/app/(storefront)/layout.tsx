import Script from "next/script";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <Toaster theme="light" richColors position="top-center" />
      <Script id="brevo-conversations" strategy="afterInteractive">
        {`
          (function(d, w, c) {
              w.BrevoConversationsID = '6a7f985b4deba2ef5006f5ae';
              w[c] = w[c] || function() {
                  (w[c].q = w[c].q || []).push(arguments);
              };
              var s = d.createElement('script');
              s.async = true;
              s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
              if (d.head) d.head.appendChild(s);
          })(document, window, 'BrevoConversations');
        `}
      </Script>
    </div>
  );
}
