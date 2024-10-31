import type { Config } from "tailwindcss";
import * as sharedConfig from "@repo/tailwind-config";
import tailwindcssAnimate from "tailwindcss-animate";
const config: Pick<Config, "prefix" | "presets" | "content" | "plugins"> = {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	prefix: "",
	presets: [sharedConfig],
	plugins: [tailwindcssAnimate],
};

export default config;
