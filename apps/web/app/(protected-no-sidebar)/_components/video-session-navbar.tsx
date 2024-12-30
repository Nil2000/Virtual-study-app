import ThemeSwtichButton from "@components/ThemeSwtichButton";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import {
	ArrowRightFromLine,
	ChevronLeft,
	ChevronRight,
	LucideBookHeadphones,
} from "lucide-react";
import React from "react";

export default function VideoSessionNavbar({
	roomId,
	roomName,
}: {
	roomId: string;
	roomName: string;
}) {
	return (
		<div className="w-full py-2 px-2 flex flex-row items-center justify-between">
			<div className="flex flex-row items-center space-x-4 h-8 font-sans">
				<LucideBookHeadphones size={24} />
				<Separator
					orientation="vertical"
					className="w-[1px] bg-muted-foreground/50"
				/>
				<div className="flex items-center">
					<h1 className="font-semibold font-poppins text-xl">{roomName}</h1>
					<ChevronLeft size={24} />
					<p className="text-muted-foreground font-mono font-bold">{roomId}</p>
					<ChevronRight size={24} />
				</div>
			</div>
			<div className="flex items-center">
				<Button className="group" variant="destructive">
					Exit Room
					<ArrowRightFromLine
						className="-me-1 ms-2 opacity-80 transition-transform group-hover:translate-x-0.5"
						size={16}
						strokeWidth={2}
						aria-hidden="true"
					/>
				</Button>
				<ThemeSwtichButton />
			</div>
		</div>
	);
}
