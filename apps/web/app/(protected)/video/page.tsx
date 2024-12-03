import React from "react";
import JoinRoomCard from "./_components/join-room";
import CreateVideoCard from "./_components/create-video-room";

export default function page() {
	return (
		<div className="font-sans grid gap-8 md:grid-cols-2 container mx-auto px-4">
			<JoinRoomCard />
			<CreateVideoCard />
		</div>
	);
}
