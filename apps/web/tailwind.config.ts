// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import * as sharedConfig from "@repo/ui/tailwind.config";

const config: Pick<Config, "presets" | "theme"> = {
	presets: [sharedConfig],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", "sans-serif"],
				mono: ["var(--font-geist-mono)", "monospace"],
				poppins: ["var(--font-poppins)", "sans-serif"],
			},
		},
	},
};

export default config;
