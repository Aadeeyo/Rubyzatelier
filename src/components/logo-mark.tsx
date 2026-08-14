/**
 * The Rubyzatelier icon: a hanger above a dress silhouette.
 * The hanger represents selection — a rack, a curated wardrobe, an atelier.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 84"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoMarkWarm" x1="0" y1="0" x2="64" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-cocoa)" />
          <stop offset="50%" stopColor="var(--color-terracotta)" />
          <stop offset="100%" stopColor="var(--color-cocoa)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="6" r="3.2" stroke="url(#logoMarkWarm)" strokeWidth="3" />
      <path
        d="M14 27 L32 12 L50 27"
        stroke="url(#logoMarkWarm)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 26
           C24 26 18 33 18 41
           C18 47 21 52 26 55
           L8 76
           C8 80 12 82 16 82
           L48 82
           C52 82 56 80 56 76
           L38 55
           C43 52 46 47 46 41
           C46 33 40 26 32 26
           Z"
        fill="url(#logoMarkWarm)"
      />
    </svg>
  );
}
