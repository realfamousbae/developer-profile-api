import { Injectable } from '@nestjs/common';

import { Prisma, type Profile } from '../generated/prisma/client.ts';
import { PrismaService } from '../database/prisma.service.ts';

const profileRelations = {
  professionalLinks: { orderBy: { sortOrder: 'asc' as const } },
  skills: { orderBy: { sortOrder: 'asc' as const } },
  experiences: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      achievements: { orderBy: { sortOrder: 'asc' as const } },
    },
  },
  projects: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      technologies: { orderBy: { sortOrder: 'asc' as const } },
    },
  },
} satisfies Prisma.ProfileInclude;

export type ProfileRecord = Prisma.ProfileGetPayload<{
  include: typeof profileRelations;
}>;

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: Profile['slug']): Promise<ProfileRecord | null> {
    return this.prisma.profile.findUnique({
      where: { slug },
      include: profileRelations,
    });
  }
}
