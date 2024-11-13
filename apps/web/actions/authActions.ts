//Server actions
"use server";
import bcrypt from "bcryptjs";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AuthError } from "next-auth";
import {
  generateEmailVerificationToken,
  generateResetToken,
} from "@/lib/tokens";
import {
  sendPasswordVerificationEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { getVerificationTokenByToken } from "@/data/emailVerificationToken";
import { getPasswordResetToken } from "@/data/passwordResetToken";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email, password } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateEmailVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials asdasdasd" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email, password, name } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateEmailVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
};

export const verifyEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token not found" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  await db.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified" };
};

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email" };
  }

  const existingUser = await getUserByEmail(validateFields.data!.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const resetToken = await generateResetToken(existingUser.email);

  await sendPasswordVerificationEmail(resetToken.email, resetToken.token);

  return { success: "Reset email sent" };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid password" };
  }

  const { password } = validateFields.data;

  const existingToken = await getPasswordResetToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated" };
};
