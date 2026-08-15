export const SITE_URL = "https://ruby.com.ng";

export const SITE_NAME = "Rubyzatelier";

export const SITE_DESCRIPTION =
  "Rubyzatelier — bringing elegant fashion closer to home. Affordable, clean, functional fashion for women, curated by moment: Office, Sunday, Date and Celebration. Based in Ogijo, Ogun State, serving Ogijo, Itaoluwo, Lukosi and beyond.";

export const TAGLINE = "Bringing elegant fashion closer to home.";

// Local areas served, used for local SEO copy and structured data.
export const SERVICE_AREAS = ["Ogijo", "Itaoluwo", "Lukosi"];

export const BUSINESS_ADDRESS = {
  streetAddress: "Ogijo",
  addressLocality: "Ogijo",
  addressRegion: "Ogun State",
  addressCountry: "NG",
};

export const BUSINESS_PHONE = "+2349060229398";

// Bank transfer details shown to customers at checkout. Orders are confirmed
// manually by admin once payment is received - there's no payment gateway.
export const BANK_TRANSFER = {
  bankName: process.env.BANK_NAME || "Not yet configured",
  accountName: process.env.BANK_ACCOUNT_NAME || "Not yet configured",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || "0000000000",
  isConfigured: Boolean(process.env.BANK_ACCOUNT_NUMBER),
};
