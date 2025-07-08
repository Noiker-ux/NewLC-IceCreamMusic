import { TypedRoute } from '@nestia/core';
import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { diff } from 'deep-object-diff';

@ApiTags('service')
@Controller('service')
export class AppController {
  logger = new Logger(AppController.name);

  @TypedRoute.Get()
  getService() {
    this.logger.log(
      diff(
        [
          { index: 0, id: '1' },
          { index: 1, id: '2' },
          { index: 2, id: '3' },
        ],
        [
          { index: 1, id: '2' },
          { index: 0, id: '1' },
          { index: 2, id: '3' },
        ],
      ),
    );
  }
}
