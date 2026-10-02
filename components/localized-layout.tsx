import { I18nProvider } from "@/lib/i18n/provider";
import { getI18n } from "@/lib/i18n/server";
import { ThemeProvider } from "@/lib/theme/provider";
import { getTheme } from "@/lib/theme/server";
import LanguageSwitcher from "@/components/language-switcher";

// Keep request cookies below the root layout so marketing pages stay static.
export default async function LocalizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = await getI18n();
  const theme = await getTheme();
  return (
    <I18nProvider locale={locale}>
      <ThemeProvider theme={theme}>
        <div className="flex justify-end px-5 pt-4">
          <LanguageSwitcher />
        </div>
        {children}
      </ThemeProvider>
    </I18nProvider>
  );
}
