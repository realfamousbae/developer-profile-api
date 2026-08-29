import { Query, Resolver } from '@nestjs/graphql';

import { ProfileModel } from './profile.models.ts';
import { ProfileService } from './profile.service.ts';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, {
    description: 'The complete public developer profile.',
  })
  profile(): Promise<ProfileModel> {
    return this.profileService.getDeveloperProfile();
  }
}
