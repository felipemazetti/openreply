"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setTheme } from "@/lib/theme/actions";
import { useTheme } from "@/lib/theme/provider";
import { useI18n } from "@/lib/i18n/provider";

export default function ThemeSwitcher() {
  const theme = useTheme();
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  // Shows the choice while the action runs; reverts to the server value if it throws.
  const [optimisticTheme, setOptimisticTheme] = useOptimistic<string>(theme);

  return (
    <div className="space-y-1">
      <label className="inline-flex items-center gap-2 text-sm text-muted">
        <span>{t("Theme")}</span>
        <select
          value={optimisticTheme}
          disabled={pending}
          aria-busy={pending}
          onChange={(event) => {
            const nextTheme = event.target.value;
            setFailed(false);
            startTransition(async () => {
              setOptimisticTheme(nextTheme);
              try {
                await setTheme(nextTheme);
              } catch {
                setFailed(true);
              }
            });
          }}
          className="min-h-9 rounded border border-border bg-surface px-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          <option value="system">{t("System")}</option>
          <option value="light">{t("Light")}</option>
          <option value="dark">{t("Dark")}</option>
        </select>
      </label>
      {failed && (
        <p role="alert" className="text-xs text-error">
          {t("Could not change theme. Please try again.")}
        </p>
      )}
    </div>
  );
}
