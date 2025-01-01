"use client";
import React, { useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

export default function page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const called = React.useRef(false);
  const router = useRouter();
  useEffect(() => {
    const handleCallback = async () => {
      if (called.current) {
        return;
      }
      if (!code || !state) {
        console.error("Missing code or state from Spotify callback.");
        return;
      }
      called.current = true;
      try {
        const res = await fetch(
          `/api/spotify/callback?code=${code}&state=${state}`
        );
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
        localStorage.setItem(
          "spotify_token_expiry",
          (Date.now() + data.expires_in * 1000).toString()
        );
        router.push("/pomodoro");
      } catch (error) {
        console.error(`Error handling Spotify callback: ${error}`);
        //router.push("/error"); // Redirect to error page if necessary
      }
    };

    handleCallback();
  }, [code, state, router]);

  return (
    <div>
      <h1>Processing your spotify authentication...</h1>
    </div>
  );
}
