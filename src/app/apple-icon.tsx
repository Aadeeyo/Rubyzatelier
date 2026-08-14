import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2b231e",
        }}
      >
        <svg width="120" height="158" viewBox="0 0 64 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="6" r="3.2" stroke="#f3ede3" strokeWidth="3" />
          <path
            d="M14 27 L32 12 L50 27"
            stroke="#f3ede3"
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
            fill="#f3ede3"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
