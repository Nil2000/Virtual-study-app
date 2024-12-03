import { MicOff } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function VideoCard({
	name,
	avatar,
	muted,
}: {
	name: string;
	avatar: string;
	muted: boolean;
}) {
	return (
		<div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-md">
			<Image
				src={`/image-placeholder.webp`}
				alt={`${name}'s video feed`}
				fill
				objectFit="cover"
				className="z-0"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
			<div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<span className="text-white text-sm font-medium truncate">
						{name}
					</span>
				</div>
				{muted && <MicOff className="text-red-600" />}
			</div>
		</div>
	);
}
