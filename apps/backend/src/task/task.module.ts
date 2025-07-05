import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TaskService } from './task.service';
import { SchedulerRegistry } from '@nestjs/schedule';
@Module({
  providers: [TaskService],
})
export class TaskModule implements OnModuleInit {
  logger = new Logger(TaskModule.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  onModuleInit() {
    const tasks = this.schedulerRegistry.getCronJobs();

    for (const task of tasks) {
      this.logger.log(
        `Task "${task[0]}" will be ran at ${task[1].nextDate().toISO()}`,
      );
    }
  }
}
