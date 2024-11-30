"use client";

import * as React from "react";

import { next_theme_types } from "@repo/ui/index";
import dynamic from "next/dynamic";

const NextThemesProvider = dynamic(
	() => import("@repo/ui/index").then((e) => e.ThemeProvider),
	{ ssr: false }
);
export function ThemeProvider({
	children,
	...props
}: next_theme_types.ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
