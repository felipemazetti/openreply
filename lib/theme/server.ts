import { cache } from "react";
import { cookies } from "next/headers";
import { resolveTheme, THEME_COOKIE } from "./index";

export const getTheme = cache(async () => {
  const cookieStore = await cookies();
  return resolveTheme(cookieStore.get(THEME_COOKIE)?.value);
});
