import { NextResponse, type NextRequest } from "next/server";
import { readProductImage } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const image = await readProductImage(key);

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
