import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import type { Locale } from "./localization";

const { fontFamily: notoSansSC } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["chinese-simplified", "latin"],
  ignoreTooManyRequestsWarning: true,
});

const systemSans =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const englishRootFontFamily = `Inter, ${systemSans}`;
export const englishUiFontFamily =
  `"Lark Circular", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif`;
export const chineseFontFamily = `"${notoSansSC}", ${systemSans}`;

export const getRootFontFamily = (locale: Locale) =>
  locale === "zh" ? chineseFontFamily : englishRootFontFamily;

export const getUiFontFamily = (locale: Locale) =>
  locale === "zh" ? chineseFontFamily : englishUiFontFamily;

export type LocalizedWeightLevel = "emphasis" | "heading" | "label";

export const localizedFontWeight = (
  level: LocalizedWeightLevel,
  fallback: number,
) => `var(--localized-${level}-weight, ${fallback})`;
