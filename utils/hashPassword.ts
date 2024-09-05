import { genSalt, hash } from "bcrypt-ts";

export async function hashPassword(password: string) {
  const passwordSalt = await genSalt(Number(process.env.SALT_ROUNDS!));

  const hashedPassword = await hash(password, passwordSalt);

  return hashedPassword;
}
