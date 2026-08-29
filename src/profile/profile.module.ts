import { Module } from '@nestjs/common';

import { ProfileRepository } from './profile.repository.ts';
import { ProfileResolver } from './profile.resolver.ts';
import { ProfileService } from './profile.service.ts';

@Module({
  providers: [ProfileRepository, ProfileResolver, ProfileService],
})
export class ProfileModule {}
