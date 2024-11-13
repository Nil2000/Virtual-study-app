import { getVerificationTokenByEmail } from "@/data/emailVerificationToken";
import { v4 as uuid } from "uuid";
import { db } from "@lib/db";
import { getPasswordResetToken } from "@/data/passwordResetToken";

export const generateEmailVerificationToken = async (email: string) => {
  const token = uuid();

  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const newToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return newToken;
};

export const generateResetToken = async (email: string) => {
  const token = uuid();

  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await getPasswordResetToken(email);

  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const newToken = await db.passwordResetToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return newToken;
};
