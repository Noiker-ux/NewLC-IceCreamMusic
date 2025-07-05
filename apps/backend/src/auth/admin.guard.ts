import { SetMetadata } from '@nestjs/common';

export const AdminGuard = () => SetMetadata('isAdmin', true);
