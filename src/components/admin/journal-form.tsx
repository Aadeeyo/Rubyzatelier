"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  createJournalEntry,
  updateJournalEntry,
  uploadJournalImage,
} from "@/app/admin/(dashboard)/journal/actions";
import type { Collection, JournalStatus } from "@/generated/prisma/enums";

const COLLECTION_OPTIONS: { value: Collection; label: string }[] = [
  { value: "OFFICE", label: "Office Edit" },
  { value: "SUNDAY", label: "Sunday Edit" },
  { value: "DATE", label: "Date Edit" },
  { value: "CELEBRATION", label: "Celebration Edit" },
];

export function JournalForm({
  mode,
  entryId,
  initial,
}: {
  mode: "create" | "edit";
  entryId?: string;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImageUrl: string;
    tags: string[];
    relatedCollection: Collection | null;
    status: JournalStatus;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initial?.featuredImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [relatedCollection, setRelatedCollection] = useState<Collection | "">(
    initial?.relatedCollection ?? "",
  );
  const [status, setStatus] = useState<JournalStatus>(initial?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadJournalImage(formData);
      if (!result.ok) {
        setUploadError(result.error);
        return;
      }
      setFeaturedImageUrl(result.url);
    } catch {
      setUploadError("Could not upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input = {
      title,
      excerpt: excerpt || undefined,
      content,
      featuredImageUrl: featuredImageUrl || undefined,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      relatedCollection: relatedCollection || null,
      status,
    };

    try {
      if (mode === "create") {
        const result = await createJournalEntry(input);
        if (!result.ok) {
          toast.error(result.error);
          setError(result.error);
          return;
        }
        toast.success(`${title} created`);
        router.push(`/admin/journal/${result.id}`);
      } else if (entryId) {
        const result = await updateJournalEntry(entryId, input);
        if (!result.ok) {
          toast.error(result.error);
          setError(result.error);
          return;
        }
        toast.success("Changes saved");
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "rounded-lg border border-cocoa/25 bg-ivory px-4 py-2 text-espresso outline-none focus:border-terracotta";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1 font-sans text-espresso/70">
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 font-sans text-espresso/70">
        Excerpt
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={inputClass}
        />
      </label>

      <div>
        <span className="font-sans text-espresso/70">Featured image</span>
        <div className="mt-2 flex items-center gap-4">
          {featuredImageUrl && (
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-cocoa/25 bg-cream">
              <img src={featuredImageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-cocoa/25 px-5 py-2 font-sans text-espresso/80 hover:border-terracotta hover:text-terracotta">
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {uploadError && <p className="mt-2 font-sans text-sm text-red-700">{uploadError}</p>}
      </div>

      <div>
        <span className="font-sans text-espresso/70">Content (Markdown)</span>
        <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <textarea
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown — headings, **bold**, [links](https://...), lists…"
            className={`${inputClass} font-mono text-sm`}
          />
          <div className="prose prose-sm max-w-none overflow-y-auto rounded-lg border border-cocoa/25 bg-cream px-4 py-3 text-espresso">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-espresso/40">Preview will appear here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Tags (comma separated)
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Related collection
          <select
            value={relatedCollection}
            onChange={(e) => setRelatedCollection(e.target.value as Collection | "")}
            className={inputClass}
          >
            <option value="">None</option>
            {COLLECTION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as JournalStatus)}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      {error && <p className="font-sans text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Saving…" : mode === "create" ? "Create article" : "Save changes"}
      </button>
    </form>
  );
}
