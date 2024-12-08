"use client";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect } from "react";

import ResetButton from "./reset-component";
import SelectTime from "./select-time";
import EndTimeDialog from "./endtime-dialog";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@repo/ui/components/slider";
import Script from "next/script";
import axios from "axios";
import { FaSpotify } from "react-icons/fa";

declare global {
	interface Window {
		onSpotifyWebPlaybackSDKReady: () => void;
		Spotify: any;
	}
}

export default function PomodoroComponent({
	playlistId,
	playConfetti,
}: {
	playlistId: string | undefined;
	playConfetti: () => void;
}) {
	let interval: NodeJS.Timeout;
	const [time, setTime] = React.useState(5);
	const [isActive, setIsActive] = React.useState(false);
	const [duration, setDuration] = React.useState(25 * 60);
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const audioContext = React.useRef<AudioContext | null>(null);
	const [volume, setVolume] = React.useState(50);
	const [isMuted, setIsMuted] = React.useState(false);
	const [player, setPlayer] = React.useState<any>(null);
	const [currentTrack, setCurrentTrack] = React.useState(null);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 5; // 5 minutes

	//TODO - Play song background when timer is running
	//TODO - Pause song when timer is paused
	//TODO - Stop song when timer is stopped
	//TODO - Mute and Unmute song
	//TODO - Change volume of song
	//TODO - Change song playlist
	//TODO - Remove Spotify Auth if user is already connected

	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};
	const handleDurationChange = (value: string) => {
		setDuration(parseInt(value) * 60);
		setTime(parseInt(value) * 60);
	};

	const toggleTimer = () => {
		setIsActive(!isActive);
		if (!isActive) {
			startSpotifyPlayback();
		} else {
			pauseSpotifyPlayback();
		}
	};

	const resetTimer = () => {
		setIsActive(false);
		setTime(duration);
		stopSpotifyPlayback();
	};

	const playSound = () => {
		if (isMuted) return;

		// if (!audioContext.current) {
		// 	audioContext.current = new (window.AudioContext ||
		// 		(window as any).webkitAudioContext)();
		// }

		// const oscillator = audioContext.current.createOscillator();
		// oscillator.type = "sine";
		// oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime); // 440 Hz = A4 note

		// const gainNode = audioContext.current.createGain();
		// gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
		// gainNode.gain.linearRampToValueAtTime(
		// 	volume / 100,
		// 	audioContext.current.currentTime + 0.01
		// );
		// gainNode.gain.linearRampToValueAtTime(
		// 	0,
		// 	audioContext.current.currentTime + 0.5
		// );

		// oscillator.connect(gainNode);
		// gainNode.connect(audioContext.current.destination);

		// oscillator.start();
		// oscillator.stop(audioContext.current.currentTime + 0.5);

		const audio = new Audio("/clock-alarm.mp3");
		audio.volume = volume / 100;
		audio.play();
	};

	const startSpotifyPlayback = async () => {
		if (player) {
			player
				.getCurrentState()
				.then(async (state: any) => {
					const accessToken = localStorage.getItem("spotify_access_token");
					const deviceId = localStorage.getItem("spotify_device_id");

					if (!accessToken || !deviceId) {
						console.error("Missing access token or device ID");
						return;
					}

					if (!state) {
						// No active playback, set the playlist and play
						console.log("No active playback, starting playlist");
						await axios.put("/api/spotify/play", {
							playlist_id: playlistId,
							access_token: accessToken,
							device_id: deviceId,
						});
						player.resume().then(() => {
							console.log("Playback started");
						});
						return;
					}

					// Check if the current context matches the desired playlist
					const { context } = state;
					if (!context || context.uri.split(":")[2] !== playlistId) {
						console.log("Switching to the desired playlist");
						await axios.put("/api/spotify/play", {
							playlist_id: playlistId,
							access_token: accessToken,
							device_id: deviceId,
						});
					}

					// Resume playback
					player.resume().then(() => {
						console.log("Playback resumed");
					});
				})
				.catch((error: any) => {
					console.error("Error fetching player state:", error);
				});
		}
	};

	const pauseSpotifyPlayback = () => {
		if (player) {
			player.pause();
		}
	};

	const stopSpotifyPlayback = () => {
		if (player) {
			player.pause();
			// setIsPlaying(false);
			// setCurrentTrack(null);
		}
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
		if (player) {
			player.setVolume(isMuted ? volume / 100 : 0);
		}
	};

	const handleVolumeChange = (newVolume: number[]) => {
		setVolume(newVolume[0]!);
		setIsMuted(false);
		if (player) {
			player.setVolume(newVolume[0]! / 100);
		}
	};

	// const getOAuthToken = async () => {
	// 	if (!localStorage.getItem("spotify_access_token")) {
	// 		const token = await fetch("/api/spotify/authorize")
	// 			.then((res) => res.json())
	// 			.catch((err) => {
	// 				console.error(err);
	// 			});
	// 		return token;
	// 	}
	// };

	// const SetUpSpotify = async () => {
	// 	const token = await getOAuthToken();
	// 	window.onSpotifyWebPlaybackSDKReady = () => {
	// 		const player = new window.Spotify.Player({
	// 			name: "Pomodoro Spotify Player",
	// 			getOAuthToken: (cb: (token: string) => void) => {
	// 				cb(token);
	// 			},
	// 			volume: 0.5,
	// 		});

	// 		player.addListener("ready", ({ device_id }: { device_id: string }) => {
	// 			console.log("Ready with Device ID", device_id);
	// 			setPlayer(player);
	// 		});

	// 		player.addListener("player_state_changed", (state: any) => {
	// 			if (state) {
	// 				setCurrentTrack(state.track_window.current_track);
	// 				setIsPlaying(!state.paused);
	// 			}
	// 		});

	// 		player.connect();
	// 	};
	// };

	const isTokenExpired = () => {
		const expiry_time = localStorage.getItem("spotify_token_expires");
		if (expiry_time) {
			return Date.now() > parseInt(expiry_time, 10);
		}
		return true;
	};

	const isFirstTimeSpotify = () => {
		const spotify_access_token = localStorage.getItem("spotify_access_token");
		if (!spotify_access_token) {
			return true;
		}
		return false;
	};

	const getToken = () => {
		if (isFirstTimeSpotify()) {
			// const token = await axios.get("/api/spotify/authorize");
			// console.log(token);
			window.location.href = "/api/spotify/authorize";
		} else {
			refreshToken();
		}
	};

	const refreshToken = async () => {
		const spotify_access_token = localStorage.getItem("spotify_access_token");

		if (!spotify_access_token || !isTokenExpired()) return;

		const refreshToken = localStorage.getItem("spotify_refresh_token");
		if (!refreshToken) {
			console.error("No refresh token found");
			return;
		}

		try {
			const res = await axios.post("/api/spotify/refresh-token", {
				refresh_token: refreshToken,
			});

			const token = res.data;
			localStorage.setItem("spotify_access_token", token.access_token);
			if (token.refresh_token) {
				localStorage.setItem("spotify_refresh_token", token.refresh_token);
			}
			localStorage.setItem(
				"spotify_token_expires",
				(Date.now() + token.expires_in * 1000).toString()
			);
		} catch (error) {
			console.error("Error refreshing token:", error);
		}
	};

	useEffect(() => {
		if (isActive && time > 0) {
			interval = setInterval(() => {
				setTime((time) => time - 1);
			}, 1000);
		} else if (time === 0) {
			setDialogOpen(true);
			setIsActive(false);
			playSound();
			stopSpotifyPlayback();
			playConfetti();
		}

		return () => clearInterval(interval);
	}, [time, isActive]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;
		// getToken();
		// const addSpotifySDKScript = () => {
		// 	return new Promise<void>((resolve, reject) => {
		// 		const existingScript = document.getElementById(
		// 			"spotify-web-playback-sdk"
		// 		);
		// 		if (existingScript) {
		// 			resolve();
		// 			return;
		// 		}
		// 		const script = document.createElement("script");
		// 		script.id = "spotify-web-playback-sdk";
		// 		script.src = "https://sdk.scdn.co/spotify-player.js";
		// 		script.async = true;
		// 		script.onload = () => resolve();
		// 		script.onerror = () => reject("Spotify SDK failed to load.");
		// 		document.body.appendChild(script);
		// 	});
		// };

		// const removeSpotifySDKScript = () => {
		// 	const script = document.getElementById("spotify-web-playback-sdk");
		// 	if (script) {
		// 		document.body.removeChild(script);
		// 	}
		// };
		const setUpSpotify = async () => {
			const spotify_access_token = localStorage.getItem("spotify_access_token");
			if (spotify_access_token) {
				if (isTokenExpired()) {
					await refreshToken();
				}
				// await addSpotifySDKScript();
				if (typeof window !== "undefined") {
					window.onSpotifyWebPlaybackSDKReady = () => {
						const setupSpotifyPlayer = async () => {
							const spotifyPlayer = new window.Spotify.Player({
								name: "Pomodoro Spotify Player",
								getOAuthToken: (cb: (token: string) => void) =>
									cb(spotify_access_token!),
								volume: 0.5,
							});
							spotifyPlayer.addListener(
								"ready",
								({ device_id }: { device_id: string }) => {
									console.log("Ready with Device ID", device_id);
									localStorage.setItem("spotify_device_id", device_id);
									setPlayer(spotifyPlayer);
								}
							);
							spotifyPlayer.addListener(
								"player_state_changed",
								(state: any) => {
									if (state) {
										setCurrentTrack(state.track_window.current_track);
										setIsPlaying(!state.paused);
									}
								}
							);
							spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
								console.log("Device ID has gone offline", device_id);
							});
							spotifyPlayer.connect();
						};
						setupSpotifyPlayer();
					};
				}
				intervalId = setInterval(() => {
					refreshToken();
				}, TOKEN_REFRESH_INTERVAL);
			}
		};
		setUpSpotify();
		return () => {
			if (intervalId) clearInterval(intervalId);
			// removeSpotifySDKScript();
		};
	}, []);

	return (
		<>
			{localStorage.getItem("spotify_access_token") && (
				<Script src="https://sdk.scdn.co/spotify-player.js" />
			)}
			<Card className="flex items-center justify-center w-full md:py-5 py-2 shadow-md">
				<div className="bg-background p-8 text-center w-full max-w-md">
					<h1 className="text-4xl font-bold mb-6 ">Pomodoro Timer</h1>
					<div className="text-6xl font-mono mb-8">{formatTime(time)}</div>
					<div className="mb-4">
						<SelectTime handleDurationChange={handleDurationChange} />
					</div>
					<div className="flex justify-center space-x-4 mb-6">
						<Button onClick={toggleTimer} className="w-24">
							{isActive ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
							{isActive ? "Pause" : "Start"}
						</Button>
						<ResetButton resetTimer={resetTimer} />
					</div>
					<div className="pt-4">
						<div className="flex items-center justify-center space-x-4">
							<Button
								onClick={toggleMute}
								variant="outline"
								size="icon"
								aria-label={isMuted ? "Unmute" : "Mute"}
							>
								{isMuted ? (
									<VolumeX className="h-4 w-4" />
								) : (
									<Volume2 className="h-4 w-4" />
								)}
							</Button>
							<Slider
								value={[volume]}
								onValueChange={handleVolumeChange}
								max={100}
								step={1}
								className="w-32"
								aria-label="Adjust volume"
							/>
						</div>
					</div>
				</div>
				{!localStorage.getItem("spotify_access_token") && (
					<Button onClick={getToken}>
						<FaSpotify />
					</Button>
				)}
				<EndTimeDialog open={dialogOpen} setOpen={setDialogOpen} />
			</Card>
		</>
	);
}
