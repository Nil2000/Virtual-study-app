"use client";
import { joinRoom } from "@/actions/roomActions";
import { JoinRoomSchema } from "@/schemas/room";
import FormError from "@components/FormError";
import FormSuccess from "@components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/index";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function JoinRoomCard() {
	const [error, setError] = React.useState<string | undefined>("");
	const [success, setSuccess] = React.useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<z.infer<typeof JoinRoomSchema>>({
		defaultValues: {
			roomId: "",
			joinAs: "",
		},
		resolver: zodResolver(JoinRoomSchema),
	});

	const onSubmit = (values: z.infer<typeof JoinRoomSchema>) => {
		console.log(values);
		startTransition(() => {
			joinRoom(values, "PARTICIPANT").then((res) => {
				if (res?.error) {
					toast.error(res?.error);
				} else {
					toast.success("Joined room successfully");
					router.push(`/video-session/${values.roomId}`);
				}
			});
		});
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Join Study Room</CardTitle>
			</CardHeader>
			<CardDescription>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="px-6 flex flex-col space-y-3">
							<FormField
								control={form.control}
								name="roomId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Room ID</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="abc123"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="joinAs"
								render={({ field }) => (
									<FormItem>
										<div className="mb-2 flex items-center justify-between gap-1">
											<FormLabel htmlFor="join-name">Join as</FormLabel>
											<span className="text-sm text-muted-foreground">
												Optional
											</span>
										</div>
										<FormControl>
											<Input
												{...field}
												placeholder="abc123"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormError message={error!} />
							<FormSuccess message={success!} />
							<div className="flex w-full mt-auto">
								<Button className="group">
									Join
									<ArrowRight
										className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</CardDescription>
			<CardFooter></CardFooter>
		</Card>
	);
}
