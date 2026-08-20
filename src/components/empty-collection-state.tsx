import { ClothingRackIcon } from "@/components/icons";

export function EmptyCollectionState() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <ClothingRackIcon size={64} className="text-cocoa/40" />
      <p className="mt-6 font-display text-2xl text-espresso">
        We are curating your wardrobe.
      </p>
      <p className="mt-2 font-sans text-lg text-espresso/60">Check back soon.</p>
    </div>
  );
}
