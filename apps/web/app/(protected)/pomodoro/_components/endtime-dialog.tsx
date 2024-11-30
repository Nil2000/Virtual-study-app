"use client";
import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";

export default function EndTimeDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent className="font-sans">
				<AlertDialogHeader>
					<AlertDialogTitle>Congratulations 🎉</AlertDialogTitle>

					<AlertDialogDescription>
						You have successfully completed the pomodoro session.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>Close</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
