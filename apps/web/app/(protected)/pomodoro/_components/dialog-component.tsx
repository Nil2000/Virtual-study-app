"use client";
import React from "react";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

export default function DialogComponent({
	open,
	setOpen,
	changePlaylist,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	changePlaylist: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	const [inputValue, setInputValue] = React.useState<string>("");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px] font-sans">
				<DialogHeader>
					<DialogTitle>Change Playlist</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Playlist link
						</Label>
						<Input
							id="playListLink"
							placeholder="Enter playlist link"
							type="url"
							value={inputValue}
							className="col-span-3"
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								if (inputValue) {
									changePlaylist(inputValue!);
								}
							}}
						>
							Save changes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
