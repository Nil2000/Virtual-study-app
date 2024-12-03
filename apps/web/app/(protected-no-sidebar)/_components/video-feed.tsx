import React from "react";
import VideoCard from "./video-card";
const participants = [
	{
		id: "1",
		name: "Alice",
		avatar: "/placeholder.svg?height=32&width=32",
		muted: false,
	},
	{
		id: "2",
		name: "Bob",
		avatar: "/placeholder.svg?height=32&width=32",
		muted: true,
	},
	{
		id: "3",
		name: "Charlie",
		avatar: "/placeholder.svg?height=32&width=32",
		muted: false,
	},
	{
		id: "4",
		name: "David",
		avatar: "/placeholder.svg?height=32&width=32",
		muted: false,
	},
	// {
	// 	id: "5",
	// 	name: "Eve",
	// 	avatar: "/placeholder.svg?height=32&width=32",
	// 	muted: true,
	// },
];

export default function VideoFeed() {
	const squareRoot = Math.floor(Math.sqrt(participants.length));
	const gridSize = squareRoot * squareRoot;

	const gridParticipants = participants.slice(0, gridSize);
	const flexParticipants = participants.slice(gridSize);

	const gridColumns = `grid-cols-${squareRoot}`;
	return (
		<div className="w-full flex flex-col items-center gap-4">
			{/* Grid for largest perfect square */}
			<div
				className={`grid ${gridColumns} gap-4 auto-rows-fr lg:max-w-[768px] w-full`}
			>
				{gridParticipants.map((participant) => (
					<VideoCard key={participant.id} {...participant} />
				))}
			</div>
			{/* Flex row for remaining participants */}
			{flexParticipants.length > 0 && (
				<div className="flex justify-center gap-4 w-full">
					{flexParticipants.map((participant) => (
						<div key={participant.id} className="w-1/3">
							<VideoCard {...participant} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
