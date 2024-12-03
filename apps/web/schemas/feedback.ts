import * as z from 'zod';

export const FeedbackSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email(),
  type: z.enum(["comment", "feature"]),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});