import React from "react";
import MediaSettings from "./media-setting";
import VideoFeed from "./video-feed";

export default function VideoSection() {
	const [isMic, setIsMic] = React.useState(true);
	const [isVideo, setIsVideo] = React.useState(true);
	const [isScreenShare, setIsScreenShare] = React.useState(false);

	const toggleMic = () => setIsMic((prev) => !prev);
	const toggleVideo = () => setIsVideo((prev) => !prev);
	const toggleScreenShare = () => setIsScreenShare((prev) => !prev);
	return (
		<div className="w-[70%] border-r h-full flex flex-col">
			<div className="h-full w-full flex justify-center">
				<VideoFeed />
			</div>
			<MediaSettings
				isMic={isMic}
				isVideo={isVideo}
				isScreenShare={isScreenShare}
				toggleMic={toggleMic}
				toggleVideo={toggleVideo}
				toggleScreenShare={toggleScreenShare}
			/>
		</div>
	);
}
