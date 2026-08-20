import { ClothingRackIcon } from "@/components/icons";

export function EmptyState({
  title = "We are curating your wardrobe.",
  subtitle = "Check back soon.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <ClothingRackIcon size={64} className="text-cocoa/40" />
      <p className="mt-6 font-display text-2xl text-espresso">{title}</p>
      <p className="mt-2 font-sans text-lg text-espresso/60">{subtitle}</p>
    </div>
  );
}
