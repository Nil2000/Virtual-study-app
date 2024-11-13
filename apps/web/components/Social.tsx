"use client";
import { Button } from "@repo/ui/components/button";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Social() {
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button
				size={"lg"}
				className="w-full"
				variant={"outline"}
				onClick={() => {}}
			>
				<FcGoogle />
			</Button>
			{/* <Button
				size={"lg"}
				className="w-full"
				variant={"outline"}
				onClick={() => {}}
			>
				<FaGithub />
			</Button> */}
		</div>
	);
}
