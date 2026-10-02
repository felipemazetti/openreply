"use server";

import { cookies } from "next/headers";
import { isTheme, THEME_COOKIE } from "./index";

export async function setTheme(value: string) {
  if (!isTheme(value)) throw new Error("Unsupported theme");
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
