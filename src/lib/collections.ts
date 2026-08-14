import type { Collection } from "@/generated/prisma/enums";

export const COLLECTION_SLUGS: Record<string, Collection> = {
  office: "OFFICE",
  sunday: "SUNDAY",
  date: "DATE",
  celebration: "CELEBRATION",
};

export const COLLECTION_COPY: Record<
  Collection,
  { slug: string; label: string; description: string; image: string }
> = {
  OFFICE: {
    slug: "office",
    label: "Office Edit",
    description: "Elegant workwear for ambitious women.",
    image: "/products/placeholder-1.svg",
  },
  SUNDAY: {
    slug: "sunday",
    label: "Sunday Edit",
    description: "Feminine pieces designed for worship and fellowship.",
    image: "/products/placeholder-3.svg",
  },
  DATE: {
    slug: "date",
    label: "Date Edit",
    description: "Effortless styles for meaningful moments.",
    image: "/products/placeholder-5.svg",
  },
  CELEBRATION: {
    slug: "celebration",
    label: "Celebration Edit",
    description: "Statement looks for unforgettable occasions.",
    image: "/products/placeholder-7.svg",
  },
};

export const COLLECTIONS_ORDER: Collection[] = ["OFFICE", "SUNDAY", "DATE", "CELEBRATION"];
