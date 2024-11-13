"use client";

import { verifyEmail } from "@/actions/authActions";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@repo/ui/components/card";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";
import { Button } from "@repo/ui/components/button";

export default function EmailVerification() {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		if (!token) {
			setError("Missing token");
			return;
		}
		verifyEmail(token)
			.then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					setSuccess(data.success);
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	}, [token]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);
	return (
		<Card className="w-[350px] font-sans">
			<CardHeader>
				<CardTitle>Email Verification</CardTitle>
				<CardDescription>Verifying your email address</CardDescription>
			</CardHeader>
			<CardContent>
				{!error && !success && (
					<div className="w-full flex justify-center">
						<ScaleLoader color="#0065dd" />
					</div>
				)}
				<FormError message={error!} />
				<FormSuccess message={success!} />
			</CardContent>
			<CardFooter className="flex justify-center">
				<Button variant="outline" onClick={() => (window.location.href = "/")}>
					Return to Home
				</Button>
			</CardFooter>
		</Card>
	);
}
