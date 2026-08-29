import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '../src/generated/prisma/client.ts';
import { developerProfile } from './seed-data.ts';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function replaceProfileData(): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const profile = await transaction.profile.upsert({
      where: { slug: developerProfile.slug },
      update: {
        name: developerProfile.name,
        headline: developerProfile.headline,
        description: developerProfile.description,
      },
      create: {
        slug: developerProfile.slug,
        name: developerProfile.name,
        headline: developerProfile.headline,
        description: developerProfile.description,
      },
    });

    await transaction.professionalLink.deleteMany({
      where: { profileId: profile.id },
    });
    await transaction.skill.deleteMany({ where: { profileId: profile.id } });
    await transaction.experience.deleteMany({
      where: { profileId: profile.id },
    });
    await transaction.project.deleteMany({ where: { profileId: profile.id } });

    await transaction.profile.update({
      where: { id: profile.id },
      data: {
        professionalLinks: {
          create: developerProfile.professionalLinks.map((link, sortOrder) => ({
            ...link,
            sortOrder,
          })),
        },
        skills: {
          create: developerProfile.skills.map((skill, sortOrder) => ({
            ...skill,
            sortOrder,
          })),
        },
        experiences: {
          create: developerProfile.experiences.map(
            ({ achievements, ...experience }, sortOrder) => ({
              ...experience,
              sortOrder,
              achievements: {
                create: achievements.map((text, achievementOrder) => ({
                  text,
                  sortOrder: achievementOrder,
                })),
              },
            }),
          ),
        },
        projects: {
          create: developerProfile.projects.map(
            ({ technologies, ...project }, sortOrder) => ({
              ...project,
              sortOrder,
              technologies: {
                create: technologies.map((name, technologyOrder) => ({
                  name,
                  sortOrder: technologyOrder,
                })),
              },
            }),
          ),
        },
      },
    });
  });
}

async function seed(attempt = 1): Promise<void> {
  try {
    await replaceProfileData();
  } catch (error) {
    const isRetryableConflict =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2034';

    if (isRetryableConflict && attempt < 3) {
      await seed(attempt + 1);
      return;
    }

    throw error;
  }
}

void seed()
  .then(() => {
    console.info(`Seeded profile: ${developerProfile.slug}`);
  })
  .catch((error: unknown) => {
    console.error('Failed to seed the developer profile.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
