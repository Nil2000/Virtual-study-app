"use client";
import React from "react";
import MediaSettings from "./media-setting";
import ChatComponent from "./chat-component";
import VideoSection from "./video-section";

export default function VideoSessionContent() {
	return (
		<div className="w-full px-3 h-[calc(100vh-4rem)] flex flex-col">
			<div className="flex w-full h-full">
				<VideoSection />
				<ChatComponent />
			</div>
		</div>
	);
}
