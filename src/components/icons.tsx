interface IconProps {
  size?: number;
  className?: string;
}

export function InstagramIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function ClothingRackIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* rack frame */}
      <path d="M4 21h16" />
      <path d="M6 21V6" />
      <path d="M18 21V6" />
      <path d="M4 6h16" />
      <path d="M12 6V3" />
      <circle cx="12" cy="2" r="0.9" fill="currentColor" stroke="none" />
      {/* hangers + garments */}
      <path d="M8 8l-1.5 1.2a1 1 0 0 0 .6 1.8h1.8a1 1 0 0 0 .6-1.8L8 8" />
      <path d="M8 11v4.2c0 .7.6 1.3 1.3 1.3h1.4c.7 0 1.3-.6 1.3-1.3V11" />
      <path d="M16 8l-1.5 1.2a1 1 0 0 0 .6 1.8h1.8a1 1 0 0 0 .6-1.8L16 8" />
      <path d="M13.6 12.5c.3-.7 1-1.2 1.8-1.5.8.3 1.5.8 1.8 1.5.5 1.1.2 3.4-.4 4.9a1.4 1.4 0 0 1-1.4.9 1.4 1.4 0 0 1-1.4-.9c-.6-1.5-.9-3.8-.4-4.9z" />
    </svg>
  );
}

export function TikTokIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}
