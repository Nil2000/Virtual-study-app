"use server";
import { db } from "@lib/db"
import { Session } from "next-auth";

export const checkFirstTimeSpotify = async (session: Session | null) => {
  try {
    const spotifyRefreshToken = await db.user.findFirst({
      where: {
        id: session?.user?.id
      },
      select: {
        spotifyRefreshToken: true
      }
    })

    if (spotifyRefreshToken!.spotifyRefreshToken) {
      return false
    }
    return true
  } catch (error) {
    console.error(`Error in checkFirstTimeSpotify: ${error}`)
  }
}