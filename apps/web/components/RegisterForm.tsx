"use client";

import { Input } from "@repo/ui/components/input";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import CardWrapper from "./CardWrapper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import { register } from "@/actions/authActions";

export default function RegisterForm() {
	const [error, setEror] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [mounted, setMounted] = useState(false);

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});
	const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
		console.log(values);
		setEror("");
		setSuccess("");
		startTransition(() => {
			register(values).then((res) => {
				if (res.error) {
					setEror(res.error);
				} else {
					setSuccess(res.success);
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
			title="Create an account"
			description="Enter your details to register"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="John Doe"
											type="text"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						<FormError message={error!} />
						<FormSuccess message={success!} />
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								<TbLoader2 className="animate-spin" />
							) : (
								"Create an account"
							)}
						</Button>
						<p className="text-sm text-center text-gray-600">
							Already have an account?{" "}
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
