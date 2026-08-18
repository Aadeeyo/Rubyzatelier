import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo-mark";

export function Logo({
  className,
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col items-center", className)}>
      <LogoMark className="h-[2.45rem] w-auto sm:h-[3rem]" />
      <span className="mt-1 font-script text-terracotta text-[2.65rem] leading-none tracking-wide sm:text-[3.5rem]">
        Rubyzatelier
      </span>
      {tagline && (
        <span className="mt-0.5 font-sans text-[0.7rem] uppercase tracking-[0.35em] text-cocoa">
          Fashion that fits your life&apos;s moments.
        </span>
      )}
    </Link>
  );
}
