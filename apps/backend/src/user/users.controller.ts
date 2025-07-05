import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);

  constructor() {}

  // @TypedRoute.Get('me')
  // async getMyInfo() {}
}
