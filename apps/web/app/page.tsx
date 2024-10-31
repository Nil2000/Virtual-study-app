import Image from "next/image";
import { Button } from "@repo/ui/components/button";

export default function Home() {
	return (
		<div className="font-mono">
			<h1>Welcome to Next.js!</h1>
			<Button>Click me</Button>
		</div>
	);
}
