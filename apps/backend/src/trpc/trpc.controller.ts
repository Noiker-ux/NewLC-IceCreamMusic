import {
  All,
  Controller,
  Inject,
  MethodNotAllowedException,
  OnModuleInit,
} from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
import { renderTrpcPanel } from 'trpc-ui';

@Controller()
export class TrpcController implements OnModuleInit {
  private appRouter;

  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  onModuleInit() {
    this.appRouter = this.appRouterHost.appRouter;
  }

  @All('panel')
  panel() {
    if (process.env.NODE_ENV !== 'production')
      return renderTrpcPanel(this.appRouter, {
        url: 'http://localhost:5000/trpc',
      });
    throw new MethodNotAllowedException();
  }
}
