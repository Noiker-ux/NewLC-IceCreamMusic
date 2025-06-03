import { TSessionData } from "@/shared/config/auth";
import { SignJWT, jwtVerify } from "jose";

export async function signJWT(
  payload: TSessionData,
  options: { exp: string | number }
) {
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
    const alg = "HS256";
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.id)
      .sign(secret);
  } catch (error) {
    throw new Error("Не удается подписать токен");
  }
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify<TSessionData>(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET!)
    );
    return payload;
  } catch (error) {
    throw new Error("Предоствлен неверный токен");
  }
}
