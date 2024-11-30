import { SPOTIFY_SCOPES } from "./types";

export const getSpotifyToken = async () => {
  try {
    const accessToken = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: 'grant_type=client_credentials&client_id=' + process.env.SPOTIFY_CLIENT_ID + '&client_secret=' + process.env.SPOTIFY_CLIENT_SECRET
    })
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(err)
      })
    return accessToken.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const generateRandomString = (length: number) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}