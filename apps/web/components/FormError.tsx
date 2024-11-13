import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

export default function FormError({ message }: { message: string }) {
	if (!message) return null;
	return (
		<div className="bg-red-300/20 rounded-md flex space-x-2 p-3 text-red-500 items-center">
			<ExclamationTriangleIcon className="w-4 h-4" />
			<p className="text-sm">{message}</p>
		</div>
	);
}
