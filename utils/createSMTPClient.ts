import { createTransport } from "nodemailer";

export async function createSMTPClient() {
  const transport = createTransport({
    host: process.env.SMTP_HOST!,
    port: process.env.SMTP_PORT!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  } as any);

  await transport.verify().catch(() => {
    throw new Error("Что-то пошло не так");
  });

  return transport;
}
