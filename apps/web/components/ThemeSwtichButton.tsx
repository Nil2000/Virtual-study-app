"use client";
import { Button } from "@repo/ui/components/button";
import { useTheme } from "@repo/ui/index";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ThemeSwtichButton() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Ensure component only accesses theme after mounting
	useEffect(() => {
		setMounted(true);
	}, []);

	// Render null if not yet mounted to avoid hydration mismatch
	if (!mounted) return null;
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
