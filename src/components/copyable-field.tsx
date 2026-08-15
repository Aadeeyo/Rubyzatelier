"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyableField({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) - fail silently,
      // the value is still visible and selectable to copy manually.
    }
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      {value}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="shrink-0 rounded p-1 text-cocoa transition-colors hover:text-terracotta"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </span>
  );
}
