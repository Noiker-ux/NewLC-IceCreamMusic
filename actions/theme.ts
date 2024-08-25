"use server";
// import { cookies } from "next/headers";

// export async function setTheme(theme: AviableThemes) {
//   cookies().set("theme_LK_IceCreamMusic", theme, {
//     httpOnly: true,
//     maxAge: 2592000,
//   });
// }

// export async function getTheme(): Promise<AviableThemes> {
//   return (
//     (cookies().get("theme_LK_IceCreamMusic")?.value as AviableThemes) ?? "dark"
//   );
// }

export type AviableThemes = "dark" | "light";
