import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
} from "@repo/ui/components/card";
import Link from "next/link";
import React from "react";

export default function ErrorCard() {
	return (
		<Card className="w-[400px] shadow-md ">
			<CardHeader>
				<CardTitle>Oops something went wrong</CardTitle>
				<CardDescription>Please try again later</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-center">
				<Link href="/auth/login">Back to login</Link>
			</CardFooter>
		</Card>
	);
}
