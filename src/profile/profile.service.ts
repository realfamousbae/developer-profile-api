import { Injectable, NotFoundException } from '@nestjs/common';

import type { ProfileModel } from './profile.models.ts';
import { ProfileRepository, type ProfileRecord } from './profile.repository.ts';

const DEVELOPER_PROFILE_SLUG = 'aleksey-ermakov';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getDeveloperProfile(): Promise<ProfileModel> {
    const profile = await this.profileRepository.findBySlug(
      DEVELOPER_PROFILE_SLUG,
    );

    if (!profile) {
      throw new NotFoundException('The developer profile is not initialized.');
    }

    return this.toGraphqlModel(profile);
  }

  private toGraphqlModel(profile: ProfileRecord): ProfileModel {
    return {
      name: profile.name,
      headline: profile.headline,
      description: profile.description,
      links: profile.professionalLinks.map(({ label, url }) => ({
        label,
        url,
      })),
      skills: profile.skills.map(({ name, category }) => ({
        name,
        category,
      })),
      experience: profile.experiences.map((experience) => ({
        company: experience.company,
        position: experience.position,
        startPeriod: experience.startPeriod,
        endPeriod: experience.endPeriod,
        isCurrent: experience.isCurrent,
        achievements: experience.achievements.map(({ text }) => text),
      })),
      projects: profile.projects.map((project) => ({
        name: project.name,
        description: project.description,
        url: project.url,
        repositoryUrl: project.repositoryUrl,
        technologies: project.technologies.map(({ name }) => name),
      })),
    };
  }
}
