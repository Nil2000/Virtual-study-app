"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import React from "react";
import ThemeSwtichButton from "./ThemeSwtichButton";
import Social from "./Social";

interface CardWrapperProps {
	children: React.ReactNode;
	title: string;
	description: string;
	showSocialLogin?: boolean;
}

export default function CardWrapper({
	children,
	title,
	description,
	showSocialLogin,
}: CardWrapperProps) {
	return (
		<Card className="w-full max-w-md font-sans">
			<CardHeader className="flex flex-row justify-between">
				<div>
					<CardTitle className="text-2xl font-bold">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<ThemeSwtichButton />
			</CardHeader>
			<CardContent className="space-y-4">{children}</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				{showSocialLogin && <Social />}
			</CardFooter>
		</Card>
	);
}
