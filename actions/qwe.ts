"use server";
import { createTransport } from "nodemailer";

export async function qwe() {
  const transport = createTransport({
    host: process.env.SMTP_HOST!,
    port: process.env.SMTP_PORT!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  return transport.verify().catch(() => false);
}
