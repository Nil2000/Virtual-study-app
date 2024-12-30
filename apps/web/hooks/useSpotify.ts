"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const SPOTIFY_SCOPES =
  "streaming user-read-email user-read-private playlist-read-private playlist-read-collaborative user-modify-playback-state";

const generateRandomString = (length: number) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const useSpotify = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [accessToken, setAccessToken] = React.useState<string | null>(
    localStorage.getItem("spotify_access_token")
  );
  const [refreshToken, setRefreshToken] = React.useState<string | null>(
    localStorage.getItem("spotify_refresh_token")
  );
  const [currentPlaylistId, setCurrentPlaylistId] = React.useState<string>(
    localStorage.getItem("spotify_playlist_id") || "3tkSZxR5KvwDalDKLPlMZW"
  );
  const [currentPlaying, setCurrentPlaying] = React.useState<any>({});
  const [player, setPlayer] = React.useState<any>(null);
  const [expired, setExpired] = React.useState<boolean>(false);
  const router = useRouter();

  const checkLoggedInOrNot = () => {
    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    }
  };

  const generateSpotifyAuhtoURL = () => {
    const state = generateRandomString(16);
    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&scope=${SPOTIFY_SCOPES}&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_API_REDIRECT_URI}&state=${state}`;
  };

  const setUpSpotify = async () => {
    if (!isLoggedIn) {
      console.log("Spotify not logged in");
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (checkTokenExpiry()) {
      try {
        await refreshSpotifyToken();
      } catch (error) {
        console.log("Error refreshing token", error);
        return;
      }
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Pomodoro Player",
        getOAuthToken: (cb: (token: string) => void) => cb(accessToken!),
        volume: 0.5,
      });
      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          localStorage.setItem("spotify_device_id", device_id);
        }
      );
      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });
      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }
        setCurrentPlaying(state.track_window.current_track);
      });
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  };

  const handleChangePlaylist = async (playlistId: string) => {
    localStorage.setItem("spotify_playlist_id", playlistId);
    if (player) {
      if (checkTokenExpiry()) {
        await refreshSpotifyToken();
      }
      await axios.put("/api/spotify/play", {
        playlist_id: playlistId,
        access_token: accessToken,
        device_id: localStorage.getItem("spotify_device_id"),
      });
    }
    setCurrentPlaylistId(playlistId);
  };

  const changeVolume = (volume: number) => {
    if (player) {
      player.setVolume(volume).then(() => {
        console.log("Volume changed to", volume);
      });
    }
  };

  const refreshSpotifyToken = async () => {
    if (!refreshToken) {
      console.log("No refresh token found");
      return;
    }

    try {
      const res = await axios.post("/api/spotify/refresh-token", {
        refresh_token: refreshToken,
      });
      const token = res.data;
      localStorage.setItem("spotify_access_token", token.access_token);
      setAccessToken(token.access_token);
      if (token.refresh_token) {
        localStorage.setItem("spotify_refresh_token", token.refresh_token);
        setRefreshToken(token.refresh_token);
      }

      if (token.expires_in) {
        const expiryTime = new Date().getTime() + token.expires_in * 1000;
        localStorage.setItem("spotify_token_expiry", expiryTime.toString());
      }
    } catch (error) {
      console.log("Error refreshing token", error);
    }
  };

  const checkTokenExpiry = () => {
    const expiryTime = localStorage.getItem("spotify_token_expiry");
    if (!expiryTime) {
      return true;
    }
    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expiryTime)) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isLoggedIn) {
      refreshSpotifyToken();
      setUpSpotify();
      intervalId = setInterval(
        () => {
          refreshSpotifyToken();
        },
        55 * 60 * 1000
      );
    }
    return () => {
      if (isLoggedIn && player) {
        player.disconnect();
        player.removeListener("ready");
        player.removeListener("not_ready");
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn]);

  React.useEffect(() => {
    checkLoggedInOrNot();
  }, []);

  return {
    currentPlaying,
    SpotifyLoggedIn: isLoggedIn,
    changeVolume,
    handleChangePlaylist,
    generateSpotifyAuhtoURL,
  };
};
