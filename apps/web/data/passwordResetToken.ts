import { db } from "@/lib/db";

export const getPasswordResetToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return passwordToken;
  } catch (error) {
    return null;
  }
};
