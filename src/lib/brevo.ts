// Best-effort sync to Brevo (CRM/newsletter). Never throws - a Brevo outage
// or missing API key must not block a customer's newsletter signup, since
// the email is always saved locally first (see NewsletterSubscriber).
export async function syncContactToBrevo(email: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.warn("Brevo not configured - skipping contact sync for", email);
    return;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo contact sync failed", res.status, body);
    }
  } catch (error) {
    console.error("Brevo contact sync failed", error);
  }
}
