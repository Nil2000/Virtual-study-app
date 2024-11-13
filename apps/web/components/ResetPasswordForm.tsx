"use client";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { Button } from "@repo/ui/components/button";
import CardWrapper from "./CardWrapper";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { TbLoader2 } from "react-icons/tb";
import { newPassword } from "@/actions/authActions";
import Link from "next/link";

export default function ResetPasswordForm() {
	const [mounted, setMounted] = useState(false);
	const searchParams = useSearchParams();
	const [error, setEror] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const token = searchParams.get("token");
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	});
	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		console.log(values);
		setEror("");
		setSuccess("");
		startTransition(() => {
			newPassword(values, token).then((response) => {
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
		<CardWrapper title="Reset Password" description="Enter your new password">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="*******"
											type="password"
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
								"Reset Password"
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
