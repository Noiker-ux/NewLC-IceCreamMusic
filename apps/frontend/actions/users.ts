"use server";

import { createS3Client } from "@/shared/config/s3";
import { db } from "db";
import { users } from "db/schema";
import { profileFormSchema, TProfileSchema } from "@/schema/profile.schema";
import { signUpSchema, TSignUpClientSchema } from "@/schema/signup.schema";
import { hashPassword } from "@/shared/utils/hashPassword";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { sendSignUpConfirmEmail } from "@/actions/email";
import { createSMTPClient } from "@/shared/utils/createSMTPClient";
import { signJWT } from "@/shared/utils/token";
import { cookies } from "next/headers";
import { sessionCookieName, sessionCookieOptions } from "@/shared/config/auth";
import { revalidateCurrentPath } from "./revalidate";
import { uploadFile } from "@/shared/utils/fuleUpload";

export async function registerUser(userData: TSignUpClientSchema) {
  const { email, name, password } = signUpSchema.parse(userData);

  const matchedUser = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.email, email),
  });

  if (matchedUser) {
    return {
      success: false,
      message: "Учетная запись с данным адресом эл. почты уже существует.",
    };
  }

  const smtpTransport = await createSMTPClient().catch((e) => {
    console.log(e);
    return null;
  });

  if (!smtpTransport) {
    return {
      success: false,
      message: "Что-то пошло не так",
    };
  }

  const hashedPassword = await hashPassword(password);

  const newUser = (
    await db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning({ id: users.id })
  ).pop();

  if (!newUser)
    return {
      success: false,
      message: "Что-то пошло не так",
    };

  await sendSignUpConfirmEmail(email, newUser.id, smtpTransport);

  return redirect("/signup/complete");
}

export async function isAdminUser() {
  const session = await getAuthSession();

  if (!session) {
    return false;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
  });

  if (!user) return false;

  return user.isAdmin;
}

export async function getUserSubscriptionLevel() {
  const session = await getAuthSession();

  if (!session) {
    return false;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
  });

  if (!user) return false;

  if (user.isSubscribed) return user.subscriptionLevel ?? false;

  return false;
}

export async function editProfile(profileData: FormData) {
  const session = await getAuthSession();

  if (!session) {
    return { success: false, message: "You need to log in first" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
  });

  if (!user) return { success: false, message: "You need to log in first" };

  const profileObjectProto = await new Promise((res, rej) => {
    try {
      res({
        ...Object.fromEntries(profileData.entries()),
        avatar: profileData.get("avatar") ?? undefined,
      });
    } catch (e) {
      rej(null);
    }
  });

  const profileResult = profileFormSchema.safeParse(profileObjectProto);

  if (!profileResult.success) {
    return {
      success: false,
      message: "Данные профиля не прошли проверку",
    };
  }

  const { avatar, ...otherProfileData } = profileResult.data;

  const newProfile: TProfileSchema = {
    ...otherProfileData,
    birthDate: !!profileResult.data.birthDate
      ? new Date(profileResult.data.birthDate)
      : undefined,
  };

  if (profileResult.data.avatar instanceof File) {
    const client = createS3Client();

    const avatarFile = profileResult.data.avatar;

    const avatarType = avatarFile.type.split("/")[1];

    const fileName = `${user.id}.${avatarType}`;

    const isAvatarLoaded = await uploadFile({
      bucket: "avatars",
      name: fileName,
      file: avatarFile,
      client,
    })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });

    if (!isAvatarLoaded) {
      return {
        success: false,
        message: "Не удалось загрузить аватар",
      };
    }

    newProfile.avatar = avatarType;
  }

  const dbResult = await db
    .update(users)
    .set(newProfile)
    .where(eq(users.id, user.id))
    .returning({
      id: users.id,
      avatar: users.avatar,
      name: users.name,
      isAdmin: users.isAdmin,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (!!!dbResult || dbResult.length === 0) {
    return { success: false, message: "Something went wrong" };
  }

  const newUser = dbResult.at(0);

  if (!newUser) {
    return { success: false, message: "Something went wrong" };
  }

  const newSessionToken = await signJWT(newUser, { exp: session.exp! });

  const cookiesStore = cookies();

  cookiesStore.set(sessionCookieName, newSessionToken, {
    ...sessionCookieOptions,
    expires: session.exp! * 1000,
  });

  redirect("/profile");
}

export async function getUserBalance() {
  const session = await getAuthSession();

  if (!session) {
    return { success: false, message: "You need to log in first" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    columns: { balance: true },
  });

  if (!user) return { success: false, message: "You need to log in first" };

  return {
    success: true,
    balance: user.balance,
  };
}

export async function replenishBalance(userId: string, balance: number) {
  const isAdmin = isAdminUser();

  if (!isAdmin) {
    return {
      success: false,
      message: "Недостаточно прав для совершения действия",
    };
  }

  const isSuccess = await db
    .update(users)
    .set({
      balance: sql`${users.balance} + ${balance.toFixed(2)}`,
    })
    .where(eq(users.id, userId))
    .then(() => true)
    .catch(() => false);

  if (!isSuccess)
    return {
      success: false,
      message: "Что-то пошло не так",
    };

  await revalidateCurrentPath();

  return {
    success: true,
    message: "Балунс пользователя пополнен на указанную сумму",
  };
}
