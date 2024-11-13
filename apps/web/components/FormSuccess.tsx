import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";

export default function FormSuccess({ message }: { message: string }) {
	if (!message) return null;
	return (
		<div className="bg-emerald-300/20 rounded-md flex space-x-2 p-3 text-emerald-500 items-center">
			<CheckCircledIcon className="w-4 h-4" />
			<p className="text-sm">{message}</p>
		</div>
	);
}
