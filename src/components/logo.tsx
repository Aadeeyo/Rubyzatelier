import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col items-center", className)}>
      <span className="font-script text-gradient-chrome text-4xl leading-none tracking-wide sm:text-5xl">
        Rubyzatelier
      </span>
      {tagline && (
        <span className="mt-0.5 font-sans text-[0.7rem] uppercase tracking-[0.35em] text-chrome">
          Má rìn hò hò
        </span>
      )}
    </Link>
  );
}
