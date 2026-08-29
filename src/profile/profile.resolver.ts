import { Query, Resolver } from '@nestjs/graphql';

import { ProfileModel } from './profile.models';
import { ProfileService } from './profile.service';

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
