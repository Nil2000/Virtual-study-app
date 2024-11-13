"use client";

import Link from "next/link";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/sheet";
import { Button } from "@repo/ui/components/button";
import { BookOpen, Menu, Moon, Sun } from "lucide-react";
import ThemeSwtichButton from "./ThemeSwtichButton";
import { useRouter } from "next/navigation";
interface NavItem {
	title: string;
	href: string;
}

const navItems: NavItem[] = [
	{ title: "Features", href: "#features" },
	{ title: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);
	const router = useRouter();
	return (
		<header className="px-4 lg:px-6 h-18 flex items-center py-4 border-b">
			<Link className="flex items-center justify-center font-mono" href="/">
				<BookOpen className="h-6 w-6" />
				<span className="ml-2 text-2xl font-bold">StudyTogether</span>
			</Link>
			<nav className="hidden ml-auto sm:flex gap-4 sm:gap-6">
				{navItems.map((item) => (
					<Link
						key={item.title}
						href={item.href}
						className="font-medium hover:underline underline-offset-4 font-sans"
					>
						{item.title}
					</Link>
				))}
			</nav>
			<ThemeSwtichButton />
			<Button
				className="inline-flex items-center px-4 pt-1 text-sm font-medium my-auto border text-foreground ml-3"
				variant={"ghost"}
				onClick={() => {
					router.push("/auth/signin");
				}}
			>
				Sign in
			</Button>
			<div className="flex items-center sm:hidden">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative"
							aria-label="Open Menu"
						>
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[300px] sm:w-[400px]">
						<nav className="flex flex-col gap-4">
							{navItems.map((item) => (
								<Link
									key={item.title}
									href={item.href}
									className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
									onClick={() => setIsOpen(false)}
								>
									{item.title}
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
