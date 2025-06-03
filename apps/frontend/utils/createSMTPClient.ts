import { createTransport } from "nodemailer";

export async function createSMTPClient() {
  const transport = createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: JSON.parse(process.env.SMTP_SECURE!),
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  await transport.verify().catch((e) => {
    console.error(e);
    throw new Error("Что-то пошло не так");
  });

  return transport;
}
