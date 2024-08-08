"use server";

import { createSMTPClient } from "@/utils/createSMTPClient";
import { render } from "@react-email/render";
import { sign } from "jsonwebtoken";
import SignUpConfirm from "../emails/SignUpConfirm";
import { getFullUrl } from "./url";

export async function sendSignUpConfirmEmail(email: string, id: string) {
  const magicLinkToken = sign({ id }, process.env.MAGIC_LINK_SECRET!, {
    expiresIn: "10m",
  });

  const url = new URL(await getFullUrl());

  const { href, pathname } = url;

  const domain = href.replace(pathname, "");

  const magicLink = `${domain}/confirm/${encodeURI(magicLinkToken)}`;

  const htmlEmail = await render(<SignUpConfirm link={magicLink} />);

  const smtpTransport = await createSMTPClient();

  await smtpTransport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Account registration confirmation",
    html: htmlEmail,
  });
}
