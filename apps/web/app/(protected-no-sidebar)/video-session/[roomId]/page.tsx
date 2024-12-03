import React from "react";
import VideoSessionNavbar from "../../_components/video-session-navbar";
import VideoSessionContent from "../../_components/video-session-content";

export default async function page({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const roomId = (await params).roomId;
	return (
		<>
			<VideoSessionNavbar roomId={roomId} />
			<VideoSessionContent />
		</>
	);
}
