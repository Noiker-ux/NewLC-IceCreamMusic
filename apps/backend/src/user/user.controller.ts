import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DB, schema } from 'db';
import { eq, InferSelectModel } from 'drizzle-orm';
import { Primitive } from 'typia';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { UserService } from './user.service';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

export type TUserData = Pick<
  InferSelectModel<typeof schema.users>,
  | 'id'
  | 'email'
  | 'avatar'
  | 'birthDate'
  | 'country'
  | 'name'
  | 'personalSiteUrl'
  | 'telegram'
  | 'viber'
  | 'vk'
  | 'whatsapp'
  | 'balance'
  | 'isSubscribed'
  | 'subscriptionLevel'
  | 'isVerifiedAuthor'
  | 'emailVerified'
  | 'isAdmin'
>;

export type TGetMeResponse = {
  data: TUserData;
};

export type TUpdateMeResponse = {
  avatar: string;
};

export type TGetUsersResponse = {
  data: TUserData[];
};

export type TUpdateMeBody = {
  data: Primitive<
    Partial<
      Omit<
        TUserData,
        | 'id'
        | 'emailVerified'
        | 'isVerifiedAuthor'
        | 'subscriptionLevel'
        | 'isSubscribed'
      >
    >
  >;
};

export type TUpdateBalanceBody = {
  data: {
    balance: number;
  };
};

@ApiTags('users')
@UseGuards(AuthGuard)
@ApiSecurity('bearer')
@Controller('users')
export class UserController {
  logger = new Logger(UserController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @TypedRoute.Get()
  async getUsers(@TypedQuery() params: TPageQuery): Promise<TGetUsersResponse> {
    const users = await this.db.query.users.findMany({
      limit: params.size,
      offset: (params.page - 1) * params.size,
      columns: {
        id: true,
        email: true,
        avatar: true,
        name: true,
        birthDate: true,
        country: true,
        personalSiteUrl: true,
        telegram: true,
        viber: true,
        vk: true,
        whatsapp: true,
        balance: true,
        emailVerified: true,
        isSubscribed: true,
        subscriptionLevel: true,
        isVerifiedAuthor: true,
        isAdmin: true,
      },
    });

    return { data: users };
  }

  @TypedRoute.Get('me')
  async getMyInfo(@Session() sessionToken: string): Promise<TGetMeResponse> {
    const { session } = await this.sessionService.validateSession(sessionToken);

    if (!session) throw new UnauthorizedException('Необходима авторизация');

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, session.userId),
      columns: {
        id: true,
        email: true,
        avatar: true,
        name: true,
        birthDate: true,
        country: true,
        personalSiteUrl: true,
        telegram: true,
        viber: true,
        vk: true,
        whatsapp: true,
        balance: true,
        emailVerified: true,
        isSubscribed: true,
        subscriptionLevel: true,
        isVerifiedAuthor: true,
        isAdmin: true,
      },
    });

    if (!user) throw new InternalServerErrorException('Что-то пошло не так');

    return {
      data: user,
    };
  }

  @TypedRoute.Patch('me')
  async updateMyInfo(
    @Session() sessionToken: string,
    @TypedBody() body: TUpdateMeBody,
  ): Promise<TUpdateMeResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new UnauthorizedException('Необходима авторизация');

    const updatedUserData = body.data;

    let avatarUrl = '';

    if (updatedUserData.avatar) {
      avatarUrl = await this.userService.createPublicUrl(
        `${user.id}.${updatedUserData.avatar}`,
      );
    }

    const birthDate = updatedUserData.birthDate
      ? new Date(updatedUserData.birthDate)
      : user.birthDate;

    await this.db
      .update(schema.users)
      .set({ ...updatedUserData, birthDate })
      .where(eq(schema.users.id, user.id));

    return { avatar: avatarUrl };
  }

  @AdminGuard()
  @TypedRoute.Patch(':userId/balance')
  async updateBalance(
    @TypedBody() body: TUpdateBalanceBody,
    @TypedParam('userId') userId: string,
  ): Promise<TSuccessionResponse> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    await this.db
      .update(schema.users)
      .set({ balance: body.data.balance })
      .where(eq(schema.users.id, user.id));

    return { success: true };
  }

  // @TypedRoute.Delete('me')
  // async deleteMyInfo(
  //   @Session() sessionToken: string,
  // ): Promise<TSuccessionResponse> {
  //   return { success: true };
  // }
}
