import * as z from "zod";

export const JoinRoomSchema = z.object({
  roomId: z.string().min(7, {
    message: "Room ID invalid (Should be 7 characters long)"
  }),
  joinAs: z.string().optional()
})

export const CreateRoomSchema = z.object({
  roomName: z.string().min(3, {
    message: "Room Name invalid (Should be 3 characters long)"
  }),
  duration: z.number().int().min(1, {
    message: "Duration invalid (Should be 1 hour long)"
  }),
  maxPeople: z.number().int().nonnegative().max(100, {
    message: "Max People invalid (Should be less than 100)"
  })
})