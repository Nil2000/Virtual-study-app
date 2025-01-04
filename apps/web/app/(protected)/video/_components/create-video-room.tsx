"use client";
import { createRoom, joinRoom } from "@/actions/roomActions";
import { CreateRoomSchema } from "@/schemas/room";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/index";
import { ArrowRight } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const studyDurations = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
];

const groupSizeOptions = [
  { value: 5, label: "5 Students" },
  { value: 7, label: "7 Students" },
  { value: 10, label: "10 Students" },
  { value: 15, label: "15 Students" },
  { value: 20, label: "20 Students" },
  { value: 25, label: "25 Students" },
  { value: 30, label: "30 Students" },
];

export default function CreateVideoCard() {
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateRoomSchema>>({
    defaultValues: {
      roomName: "",
      joinAs: "",
      maxPeople: 5,
    },
    resolver: zodResolver(CreateRoomSchema),
  });

  const onSubmit = (values: z.infer<typeof CreateRoomSchema>) => {
    console.log(values);
    startTransition(() => {
      createRoom(values).then((res) => {
        if (res?.error) {
          toast.error(res?.error);
          console.log(res?.error);
        } else {
          toast.success("Room created successfully");
          const roomId = res.roomId!;
          joinRoom({ roomId: roomId, joinAs: values.joinAs }, "HOST").then(
            (res) => {
              if (res?.error) {
                toast.error(res?.error);
              } else {
                toast.success("Joined room successfully");
                router.push(`/video-session/${roomId}`);
              }
            }
          );
        }
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Study Room</CardTitle>
      </CardHeader>
      <CardDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 flex flex-col space-y-3">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
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
                name="maxPeople"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Max People</FormLabel>
                    <Select
                      onValueChange={(value: any) =>
                        // console.log(e.target.value);
                        form.setValue("maxPeople", parseInt(value))
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select max people" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-sans">
                        {groupSizeOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <div className="flex w-full">
                <Button className="group" disabled={isPending}>
                  Create and Join
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
