import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
export default function SelectTime({
	handleDurationChange,
}: {
	handleDurationChange: (value: string) => void;
}) {
	return (
		<Select onValueChange={handleDurationChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="25 minutes" />
			</SelectTrigger>
			<SelectContent className="font-sans">
				<SelectItem value="25">25 minutes</SelectItem>
				<SelectItem value="30">30 minutes</SelectItem>
				<SelectItem value="60">1 hour</SelectItem>
				<SelectItem value="90">1.5 hours</SelectItem>
				<SelectItem value="120">2 hours</SelectItem>
			</SelectContent>
		</Select>
	);
}
