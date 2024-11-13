"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "@repo/ui/index";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
