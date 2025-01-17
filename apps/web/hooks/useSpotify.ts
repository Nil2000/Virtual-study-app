"use client";
import axios from "axios";
import { access } from "fs";
import { useRouter } from "next/navigation";
import React from "react";
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}
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
  const [currentPlaying, setCurrentPlaying] = React.useState<any | null>(null);
  const [player, setPlayer] = React.useState<any>(null);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [vol, setVol] = React.useState<number>(50);
  const [playListInfo, setPlayListInfo] = React.useState<string | undefined>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const generateSpotifyAuthURL = () => {
    const state = generateRandomString(16);
    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&scope=${SPOTIFY_SCOPES}&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_API_REDIRECT_URI}&state=${state}`;
  };

  const setUpSpotify = async () => {
    //console.log("Setting up Spotify");
    if (!isLoggedIn) {
      //console.log("Spotify not logged in");
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

    if (typeof window === "undefined") {
      return;
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
          //console.log("Ready with Device ID", device_id);
          localStorage.setItem("spotify_device_id", device_id);
        }
      );
      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        //console.log("Device ID has gone offline", device_id);
      });
      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) {
          setCurrentPlaying(null);
          return;
        }
        setCurrentPlaying(state.track_window.current_track);
      });
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  };

  const handleChangePlaylist = async (playListUrl: string) => {
    const playlistId = playListUrl.split("/").pop()?.split("?")[0];
    if (!playlistId) return;
    localStorage.setItem("spotify_playlist_id", playlistId);
    if (player) {
      try {
        // if (checkTokenExpiry()) {
        //   await refreshSpotifyToken();
        // }
        // await axios.put("/api/spotify/play", {
        //   playlist_id: playlistId,
        //   access_token: localStorage.getItem("spotify_access_token"),
        //   device_id: localStorage.getItem("spotify_device_id"),
        // });
        getPlayListDetails(playlistId);
        setCurrentPlaylistId(playlistId);
      } catch (error) {
        console.log("Error changing playlist", error);
      }
    }
  };

  const changeVolume = (volume: number) => {
    setVol(volume);
    setMuted(false);
    if (player) {
      player.setVolume(volume / 100);
    }
  };

  const pause = () => {
    if (player) {
      player.pause();
    }
  };

  const stop = () => {
    if (player) {
      player.pause();
    }
    setIsPlaying(false);
  };

  const play = () => {
    if (player) {
      player.resume();
    }
  };

  const start = () => {
    if (player) {
      player.getCurrentState().then(async (state: any) => {
        try {
          const device_id = localStorage.getItem("spotify_device_id");
          if (!accessToken || !device_id) {
            return;
          }

          if (!state) {
            await axios.put("/api/spotify/play", {
              playlist_id: currentPlaylistId,
              access_token: accessToken,
              device_id,
            });
            await axios.put("/api/spotify/repeat", {
              access_token: accessToken,
              device_id,
            });
            player.resume();
            setIsPlaying(true);
            return;
          }
          //If not playing, play
          const { context } = state;

          if (
            !context ||
            context.uri !== `spotify:playlist:${currentPlaylistId}`
          ) {
            await axios.put("/api/spotify/play", {
              playlist_id: currentPlaylistId,
              access_token: accessToken,
              device_id,
            });
            await axios.put("/api/spotify/repeat", {
              access_token: accessToken,
              device_id,
            });
          }

          player.resume();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error playing", error);
        }
      });
    }
  };

  const getPlayListDetails = async (playlistId: string) => {
    if (!accessToken) return;

    if (checkTokenExpiry()) {
      await refreshSpotifyToken();
    }

    try {
      const res = await axios.post(`/api/spotify/playlist/`, {
        playlistId,
        access_token: accessToken,
      });
      setPlayListInfo(res.data);
    } catch (error) {
      console.error("Error getting playlist details", error);
    }
  };

  const refreshSpotifyToken = async () => {
    if (!refreshToken) {
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

  const toggleMute = () => {
    setMuted(!muted);
    if (player) {
      player.setVolume(muted ? vol / 100 : 0);
    }
  };

  const checkLoggedInOrNot = async () => {
    if (accessToken && refreshToken) {
      if (checkTokenExpiry()) {
        await refreshSpotifyToken();
      }
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem("spotify_playlist_id");
    localStorage.removeItem("spotify_device_id");
    setIsLoggedIn(false);
  };

  React.useEffect(() => {
    const init = async () => {
      await checkLoggedInOrNot();
    };
    init();
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isLoggedIn) {
      setUpSpotify().then(() => {
        getPlayListDetails(currentPlaylistId);
      });
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

  return {
    currentPlaying,
    changeVolume,
    changePlaylist: handleChangePlaylist,
    generateSpotifyAuthURL,
    isLoggedIn,
    play,
    toggleMute,
    muted,
    pause,
    stop,
    currentPlaylistId,
    vol,
    start,
    playListInfo,
    isPlaying,
    logout,
  };
};
