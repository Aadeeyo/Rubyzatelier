import { JournalForm } from "@/components/admin/journal-form";

export default function NewJournalEntryPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">New Article</h1>
      <div className="mt-8 max-w-4xl">
        <JournalForm mode="create" />
      </div>
    </div>
  );
}
