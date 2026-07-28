"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession, clearAdminSession } from "@/lib/auth";

export async function loginAdmin(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const admin = await authenticateAdmin(email, password);
  if (!admin) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
