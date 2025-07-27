import { Controller, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('releases')
@ApiSecurity('bearer')
@UseGuards(AuthGuard)
@Controller('releases')
export class ReleaseController {
  // @TypedRoute.Get()
  // async getReleases() {}
  // @TypedRoute.Get(':releaseId')
  // async getReleaseById(@Session() sessionToken: string) {}
  // @TypedRoute.Get(':releaseId/tracks')
  // async getReleaseTracks() {}
  // @TypedRoute.Post()
  // async createRelease() {}
  // @TypedRoute.Post(':releaseId/tracks')
  // async createReleaseTrack() {}
  // @TypedRoute.Patch(':releaseId/tracks/:trackId')
  // async updateReleaseTrack() {}
  // @TypedRoute.Delete(':releaseId/tracks/:trackId')
  // async deleteReleaseTrack() {}
  // @TypedRoute.Patch(':releaseId')
  // async updateRelease() {}
  // @TypedRoute.Delete(':releaseId')
  // async deleteRelease() {}
  // @TypedRoute.Patch(':releaseId/moderation')
  // async updateReleaseModerationStatus() {}
  // @TypedRoute.Patch(':releaseId/status')
  // async updateReleaseStatus() {}
}
