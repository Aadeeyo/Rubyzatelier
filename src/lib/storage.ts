import "server-only";
import { getStore } from "@netlify/blobs";

/**
 * Product image storage. Currently backed by Netlify Blobs — swap the body
 * of `uploadProductImage` (and the read side in the /api/images route) for
 * Cloudinary or another provider later without touching any calling code,
 * since callers only depend on getting back a URL string.
 */

function store() {
  return getStore({
    name: "product-images",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
  });
}

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function isSupportedImageType(contentType: string): boolean {
  return contentType in EXTENSION_BY_TYPE;
}

export async function uploadProductImage(
  data: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const extension = EXTENSION_BY_TYPE[contentType] ?? "bin";
  const key = `${crypto.randomUUID()}.${extension}`;

  await store().set(key, data, { metadata: { contentType } });

  return `/api/images/${key}`;
}

export async function readProductImage(
  key: string,
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  const result = await store().getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return null;

  return {
    data: result.data,
    contentType:
      typeof result.metadata?.contentType === "string"
        ? result.metadata.contentType
        : "application/octet-stream",
  };
}
