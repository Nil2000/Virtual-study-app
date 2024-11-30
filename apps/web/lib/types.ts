export type Track = {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
};

export const SPOTIFY_SCOPES = "streaming user-read-email user-read-private playlist-read-private playlist-read-collaborative user-modify-playback-state";