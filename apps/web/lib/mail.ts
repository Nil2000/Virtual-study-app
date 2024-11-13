import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `<a href="http://localhost:3001/auth/verify-email?token=${token}">Click here to verify your email</a>`,
  });
};

export const sendPasswordVerificationEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `<a href="http://localhost:3001/auth/reset-password?token=${token}">Click here to reset your password</a>`,
  });
};
