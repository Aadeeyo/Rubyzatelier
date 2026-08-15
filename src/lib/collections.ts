import type { Collection } from "@/generated/prisma/enums";

export const COLLECTION_SLUGS: Record<string, Collection> = {
  "office-edit": "OFFICE",
  "sunday-edit": "SUNDAY",
  "date-edit": "DATE",
  "celebration-edit": "CELEBRATION",
};

export const COLLECTION_COPY: Record<
  Collection,
  {
    slug: string;
    label: string;
    description: string;
    metaDescription: string;
    introParagraph: string;
    image: string;
  }
> = {
  OFFICE: {
    slug: "office-edit",
    label: "Office Edit",
    description: "Elegant workwear for ambitious women.",
    metaDescription:
      "Elegant, functional, and affordable fashion curated for women moving confidently through work and everything that follows.",
    introParagraph:
      "The Office Edit is designed for the woman who has somewhere to be. Discover elegant, functional, and affordable pieces that transition effortlessly from the workplace to everything that comes after it.",
    image: "/products/placeholder-1.svg",
  },
  SUNDAY: {
    slug: "sunday-edit",
    label: "Sunday Edit",
    description: "Feminine pieces designed for worship and fellowship.",
    metaDescription:
      "Discover elegant pieces designed for worship, family gatherings, and the meaningful moments that make Sundays special.",
    introParagraph:
      "Sundays are for worship, family, and community. The Sunday Edit brings together carefully selected pieces that feel refined, comfortable, and appropriate for every moment the day holds.",
    image: "/products/placeholder-3.svg",
  },
  DATE: {
    slug: "date-edit",
    label: "Date Edit",
    description: "Effortless styles for meaningful moments.",
    metaDescription:
      "Thoughtfully curated outfits for dates, brunches, conversations, and the beautiful moments that bring people together.",
    introParagraph:
      "Whether it's coffee, brunch, or an evening out, the Date Edit celebrates connection. Explore feminine, versatile pieces curated for conversations and memorable experiences.",
    image: "/products/placeholder-5.svg",
  },
  CELEBRATION: {
    slug: "celebration-edit",
    label: "Celebration Edit",
    description: "Statement looks for unforgettable occasions.",
    metaDescription:
      "Discover elegant, affordable styles designed for birthdays, family celebrations, milestones, and every joyful occasion.",
    introParagraph:
      "Some moments deserve to be remembered. The Celebration Edit features elegant styles curated for birthdays, family gatherings, holidays, and every occasion worth celebrating.",
    image: "/products/placeholder-7.svg",
  },
};

export const COLLECTIONS_ORDER: Collection[] = ["OFFICE", "SUNDAY", "DATE", "CELEBRATION"];
