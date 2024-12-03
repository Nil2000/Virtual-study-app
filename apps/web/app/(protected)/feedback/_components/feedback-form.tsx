"use client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FeedbackSchema } from "@/schemas/feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Button } from "@repo/ui/components/button";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";

export default function FeedbackForm() {
	const [error, setError] = React.useState<string | undefined>("");
	const [success, setSuccess] = React.useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof FeedbackSchema>>({
		resolver: zodResolver(FeedbackSchema),
		defaultValues: {
			name: "",
			email: "",
			type: "comment",
			message: "",
		},
	});

	const onSubmit = (values: z.infer<typeof FeedbackSchema>) => {
		console.log(values);
	};
	return (
		<div>
			<h1 className="text-2xl font-semibold mb-8">Submit Feedback</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col space-y-3">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="John Doe" />
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
											placeholder="johndoe@gmail.com"
											type="email"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormItem>
												<div className="flex items-center gap-2">
													<FormControl>
														<RadioGroupItem value="comment" />
													</FormControl>
													<FormLabel>Comment</FormLabel>
												</div>
											</FormItem>
											<FormItem>
												<div className="flex items-center gap-2">
													<FormControl>
														<RadioGroupItem value="feature" />
													</FormControl>
													<FormLabel>Feature request</FormLabel>
												</div>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Type your comment here..."
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div>
							<Button>Submit</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
