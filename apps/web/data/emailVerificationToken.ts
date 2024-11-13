import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verifyToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verifyToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch (error) {
    return null;
  }
};
