import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0b0d 0%, #16161a 60%, #1a2047 100%)",
          color: "#f4f2ee",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
            background: "linear-gradient(135deg, #7d8085, #ffffff 50%, #7d8085)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Rubyzatelier
        </div>
        <div style={{ fontSize: 32, letterSpacing: 8, color: "#b6b9bf", marginTop: 8 }}>
          MÁ RÌN HÒ HÒ
        </div>
        <div style={{ fontSize: 26, color: "#c1443a", marginTop: 28 }}>
          Tops · Dresses · Jeans for Women &amp; Kids
        </div>
      </div>
    ),
    { ...size },
  );
}
