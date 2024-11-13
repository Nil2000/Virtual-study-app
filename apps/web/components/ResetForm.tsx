"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { reset } from "@/actions/authActions";
import { TbLoader2 } from "react-icons/tb";
import CardWrapper from "./CardWrapper";
import Link from "next/link";

export default function ResetForm() {
	const [error, setEror] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [mounted, setMounted] = useState(false);

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		},
	});
	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		console.log(values);
		setEror("");
		setSuccess("");
		startTransition(() => {
			reset(values).then((response) => {
				if (response.error) {
					setEror(response.error);
				} else {
					setSuccess(response.success);
				}
			});
		});
	};
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<CardWrapper
			title="Reset Password"
			description="Enter your email to receive a password reset link"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="john.doe@example.com"
											type="email"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormError message={error!} />
						<FormSuccess message={success!} />
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								<TbLoader2 className="animate-spin" />
							) : (
								"Send reset email"
							)}
						</Button>
						<p className="text-sm text-center text-gray-600">
							Back to Login?{" "}
							<Link
								href="/auth/signin"
								className="text-primary hover:underline"
							>
								Log in
							</Link>
						</p>
					</div>
				</form>
			</Form>
		</CardWrapper>
	);
}
