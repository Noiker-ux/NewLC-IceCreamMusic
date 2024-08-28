import { TSelectUserSchema } from "@/schema/user.schema";
import { SessionOptions } from "iron-session";

export const routeTypes = ["guest", "public"] as const;

export type RouteType = (typeof routeTypes)[number];

export const routes: Record<RouteType, string[]> = {
  guest: ["/signin", "/signup", "/confirm", "/recover", "/reset"],
  public: ["/signout"],
};

export const defaultAuthRedirect = "/dashboard";

export type TSessionData = {
  user?: TSelectUserSchema;
};

export const defaultSessionData: TSessionData = {};

export const defaultSessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: "icecream-auth",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
  },
};

export function createSessionOptions(
  opts?: Partial<SessionOptions>
): SessionOptions {
  if (!opts) return defaultSessionOptions;

  return { ...defaultSessionOptions, ...opts };
}
