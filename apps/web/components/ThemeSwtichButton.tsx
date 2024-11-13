"use client";
import { Button } from "@repo/ui/components/button";
import { useTheme } from "@repo/ui/index";
import { Moon, Sun } from "lucide-react";
import React from "react";

export default function ThemeSwtichButton() {
	const { theme, setTheme } = useTheme();
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
			className="ml-4"
		>
			{theme === "dark" ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</Button>
	);
}
