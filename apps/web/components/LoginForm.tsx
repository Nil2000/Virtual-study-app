"use client";

import React, { useEffect, useState, useTransition } from "react";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
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
import { useSearchParams } from "next/navigation";
import { TbLoader2 } from "react-icons/tb";
import Link from "next/link";
import { login } from "@/actions/authActions";
export default function LoginForm() {
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "Email already in use"
			: "";
	const [error, setEror] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [mounted, setMounted] = useState(false);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		console.log(values);
		setEror("");
		setSuccess("");
		startTransition(() => {
			//call api
			login(values).then((res) => {
				if (res?.error) {
					setEror(res?.error);
				} else {
					setSuccess(res?.success);
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
			title="Log in to your account"
			description="Enter your email and password to log in"
			showSocialLogin
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
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="******"
											type="password"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormError message={error || urlError} />
						<FormSuccess message={success!} />
						<div className="flex justify-between w-full text-sm">
							<Link href="/auth/reset" className="text-primary hover:underline">
								Forgot password?
							</Link>
							<Link
								href="/auth/signup"
								className="text-primary hover:underline"
							>
								Create an account
							</Link>
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? <TbLoader2 className="animate-spin" /> : "Login"}
						</Button>
					</div>
				</form>
			</Form>
		</CardWrapper>
	);
}
