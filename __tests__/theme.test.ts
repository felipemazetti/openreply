import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => store }));

import { setTheme } from "../lib/theme/actions";
import { getTheme } from "../lib/theme/server";
import { resolveTheme, THEME_COOKIE } from "../lib/theme";

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllEnvs());

describe("theme preference", () => {
  it("follows the system for absent or unsupported values", () => {
    for (const value of [undefined, null, "", "Dark", "auto", "dark; path=/"]) {
      expect(resolveTheme(value)).toBe("system");
    }
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("reads the saved theme on the server before hydration", async () => {
    store.get.mockReturnValue({ value: "dark" });
    expect(await getTheme()).toBe("dark");
    expect(store.get).toHaveBeenCalledWith(THEME_COOKIE);
  });

  it("falls back to the system theme for an invalid cookie", async () => {
    store.get.mockReturnValue({ value: "sepia" });
    expect(await getTheme()).toBe("system");
  });

  it("persists only the theme cookie, across routes and browser restarts", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await setTheme("light");
    expect(store.set).toHaveBeenCalledExactlyOnceWith(THEME_COOKIE, "light", {
      path: "/",
      maxAge: 31_536_000,
      sameSite: "lax",
      httpOnly: true,
      secure: true,
    });
  });

  it("rejects an unsupported theme without writing cookies", async () => {
    await expect(setTheme("dark; path=/")).rejects.toThrow("Unsupported theme");
    expect(store.set).not.toHaveBeenCalled();
  });
});
