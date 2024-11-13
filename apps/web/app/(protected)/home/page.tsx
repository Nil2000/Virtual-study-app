import { auth, signOut } from "@lib/auth";
import { Button } from "@repo/ui/components/button";
import React from "react";

export default async function page() {
	const session = await auth();

	return (
		<div>
			Home page
			<p>{JSON.stringify(session)}</p>
			<Button
				onClick={async () => {
					"use server";
					await signOut();
				}}
			>
				Sign out
			</Button>
		</div>
	);
}
