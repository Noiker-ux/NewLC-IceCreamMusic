import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt-ts';
import { DB, schema, verificationTokenTypeValues } from 'db';
import { and, eq, InferSelectModel } from 'drizzle-orm';
import { AuthService } from './auth.service';
import { Session } from './session.decorator';
import { SessionService } from './session.service';
import { TSuccessionResponse } from '../shared/types';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

export type TOauthAccountData = {
  providerAccountId: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  sex?: number;
  birthday?: string;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  scope: string;
  provider: string;
  verified: boolean;
};

export type TCredentialsSignInBody = {
  email: string;
  password: string;
};

export type TSessionResponse = { session_token: string };

export type TCredentialsSignUpBody = {
  email: string;
  password: string;
  name: string;
};

export type TCredentialsSignUpResponse = {
  verificationToken: string;
};

export type TRecoverPasswordBody = {
  token: string;
  password: string;
};

export type TCheckSessionResponse = {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    isAdmin: boolean;
  };
};

export type TRequestPasswordRecoveryBody = {
  email: string;
};

export type TRequestPasswordRecoveryResponse = {
  emailToken: string;
};

export type TUser = InferSelectModel<typeof schema.users>;

export type TTokenValue = (typeof verificationTokenTypeValues)[number];

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    @Inject('DB_TAG') private readonly db: DB,
    private readonly config: ConfigService,
  ) {}

  @TypedRoute.Get()
  async checkSessionToken(
    @Session() token: string,
  ): Promise<TCheckSessionResponse> {
    const { user } = await this.sessionService.validateSession(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { id, isAdmin, avatar, name } = user;

    let userAvatar = avatar;

    if (!!avatar) {
      const avatarUrl = new URL(process.env.NEXT_PUBLIC_S3_URL!);

      avatarUrl.pathname = `/avatars/${id}.${avatar}`;

      userAvatar = avatarUrl.href;
    }

    return { user: { id, isAdmin, avatar: userAvatar, name } };
  }

  @TypedRoute.Post('oauth')
  async OAuthSignin(
    @TypedBody() body: TOauthAccountData,
  ): Promise<TSessionResponse> {
    const {
      providerAccountId,
      email,
      name,
      avatar,
      provider,
      accessToken,
      refreshToken,
      tokenType,
      scope,
      expiresAt,
    } = body;

    if (isNaN(new Date(expiresAt).getTime())) {
      throw new BadRequestException();
    }

    const session = await this.db.transaction(async (tx) => {
      let account = await tx.query.accounts.findFirst({
        where: and(
          eq(schema.accounts.providerAccountId, providerAccountId),
          eq(schema.accounts.provider, provider),
          eq(schema.accounts.token_type, tokenType),
        ),
      });

      if (!account) {
        let user = await tx.query.users.findFirst({
          where: eq(schema.users.email, email),
        });

        if (!user) {
          user = (
            await tx
              .insert(schema.users)
              .values({
                email,
                emailVerified: new Date(),
                name,
                avatar,
              })
              .returning()
          )[0];
        }

        account = (
          await tx
            .insert(schema.accounts)
            .values({
              userId: user.id,
              providerAccountId,
              type: 'oauth',
              provider,
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: new Date(expiresAt),
              token_type: tokenType,
              scope,
            })
            .returning()
        )[0];
      } else {
        await tx.update(schema.accounts).set({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(expiresAt),
        });
      }

      const sessionToken = this.sessionService.generateToken();

      const session = this.sessionService.createSession(
        sessionToken,
        account.userId,
      );

      return (await tx.insert(schema.sessions).values(session).returning())[0];
    });

    return { session_token: session.sessionToken };
  }

  @TypedRoute.Patch('link')
  async linkAccount(
    @TypedBody() body: TOauthAccountData,
    @Session() token: string,
  ): Promise<TSuccessionResponse> {
    const {
      providerAccountId,
      provider,
      accessToken,
      refreshToken,
      tokenType,
      scope,
      expiresAt,
    } = body;

    if (isNaN(new Date(expiresAt).getTime())) {
      throw new BadRequestException();
    }

    const { user } = await this.sessionService.validateSession(token);

    if (!user) throw new UnauthorizedException();

    const success = await this.db
      .transaction(async (tx) => {
        let account = await tx.query.accounts.findFirst({
          where: and(
            eq(schema.accounts.providerAccountId, providerAccountId),
            eq(schema.accounts.provider, provider),
            eq(schema.accounts.token_type, tokenType),
          ),
        });

        if (!account) {
          account = (
            await tx
              .insert(schema.accounts)
              .values({
                userId: user.id,
                providerAccountId,
                type: 'oauth',
                provider,
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: new Date(expiresAt),
                token_type: tokenType,
                scope,
              })
              .returning()
          )[0];
        } else {
          await tx.update(schema.accounts).set({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: new Date(expiresAt),
          });
        }
      })
      .then(() => true)
      .catch(() => false);

    if (!success) throw new InternalServerErrorException('Что-то пошло не так');

    return { success: true };
  }

  @TypedRoute.Post('signin')
  async credentialsSignIn(
    @TypedBody() body: TCredentialsSignInBody,
  ): Promise<TSessionResponse> {
    const { email, password } = body;

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const passwordVerified = await compare(password, user.password);

    if (!passwordVerified) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const session = await this.sessionService.registerSession(user.id);

    return { session_token: session.sessionToken };
  }

  @TypedRoute.Post('signup')
  async credentialsSignUp(
    @TypedBody() body: TCredentialsSignUpBody,
  ): Promise<TCredentialsSignUpResponse> {
    const { email, password, name } = body;

    const existingUser = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с переданным email уже существует',
      );
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const newUser = (
      await this.db
        .insert(schema.users)
        .values({
          email,
          name,
          password: hashedPassword,
        })
        .returning()
    ).at(0);

    if (!newUser) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    const verificationToken = await this.authService.registerEmailToken(
      newUser.id,
      'confirm',
    );

    return { verificationToken: verificationToken.token };
  }

  @TypedRoute.Get('token/:type/:token')
  async verifyEmailToken(
    @TypedParam('token') emailToken: string,
    @TypedParam('type') type: TTokenValue,
  ): Promise<TSuccessionResponse> {
    const dbToken = await this.db.query.verificationTokens.findFirst({
      where: and(
        eq(schema.verificationTokens.token, emailToken),
        eq(schema.verificationTokens.type, type),
      ),
    });

    if (!dbToken) {
      throw new BadRequestException('Неверный токен');
    }

    return { success: true };
  }

  @TypedRoute.Patch('verification/:token')
  async confirmEmail(
    @TypedParam('token') emailToken: string,
  ): Promise<TSuccessionResponse> {
    const token = await this.authService.applyEmailToken(emailToken, 'confirm');

    if (!token) throw new BadRequestException('Неверный токен');

    return { success: true };
  }

  @TypedRoute.Patch('reset')
  async resetPassword(
    @TypedBody() body: TRecoverPasswordBody,
  ): Promise<TSuccessionResponse> {
    const { token, password } = body;

    if (!token) {
      throw new BadRequestException('Токен не передан');
    }

    if (!password) {
      throw new BadRequestException('Новый пароль не передан');
    }

    const dbToken = await this.authService.applyEmailToken(token, 'recover');

    if (!dbToken) {
      throw new BadRequestException('Передан неверный токен');
    }

    if (!dbToken.user.emailVerified) {
      throw new BadRequestException('Пользователь не подтвердил свой email');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    await this.db
      .update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, dbToken.userId));

    return { success: true };
  }

  @TypedRoute.Post('recover')
  async requestPasswordRecovery(
    @TypedBody() body: TRequestPasswordRecoveryBody,
  ): Promise<TRequestPasswordRecoveryResponse> {
    const { email } = body;

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const { token } = await this.authService.registerEmailToken(
      user.id,
      'recover',
    );

    return { emailToken: token };
  }
}
