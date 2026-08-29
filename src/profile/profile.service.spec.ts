import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';

import type { ProfileRecord } from './profile.repository.ts';
import type { ProfileRepository } from './profile.repository.ts';
import { ProfileService } from './profile.service.ts';

const storedProfile = {
  id: '38bbb0fd-f1da-4647-81db-7f8296df1699',
  slug: 'aleksey-ermakov',
  name: 'Aleksey Ermakov',
  headline: 'TypeScript Backend Developer',
  description: 'Profile description',
  createdAt: new Date('2026-08-29T00:00:00.000Z'),
  updatedAt: new Date('2026-08-29T00:00:00.000Z'),
  professionalLinks: [
    {
      id: 'a42611c0-7b52-4ddc-944e-341d726e39c0',
      profileId: '38bbb0fd-f1da-4647-81db-7f8296df1699',
      label: 'GitHub',
      url: 'https://github.com/realfamousbae',
      sortOrder: 0,
    },
  ],
  skills: [
    {
      id: '0358a7ef-3ff6-4140-981e-2fed153912df',
      profileId: '38bbb0fd-f1da-4647-81db-7f8296df1699',
      name: 'TypeScript',
      category: 'Language',
      sortOrder: 0,
    },
  ],
  experiences: [
    {
      id: '8e65fc32-58fc-4773-8f10-b3c57a5d0c08',
      profileId: '38bbb0fd-f1da-4647-81db-7f8296df1699',
      company: 'Independent projects',
      position: 'TypeScript Developer',
      startPeriod: '2025-10',
      endPeriod: null,
      isCurrent: true,
      sortOrder: 0,
      achievements: [
        {
          id: 'c8635c88-a9da-41cb-afb6-87b095f8e9f9',
          experienceId: '8e65fc32-58fc-4773-8f10-b3c57a5d0c08',
          text: 'Delivered a working backend.',
          sortOrder: 0,
        },
      ],
    },
  ],
  projects: [
    {
      id: 'd3e39a32-25d7-4df3-8b4d-61078c04e83e',
      profileId: '38bbb0fd-f1da-4647-81db-7f8296df1699',
      name: 'Hubble',
      description: 'Desktop productivity application',
      url: 'https://github.com/realfamousbae/hubble',
      repositoryUrl: 'https://github.com/realfamousbae/hubble',
      sortOrder: 0,
      technologies: [
        {
          id: '49e89c46-99e9-4e17-a798-35003c0ef5cf',
          projectId: 'd3e39a32-25d7-4df3-8b4d-61078c04e83e',
          name: 'TypeScript',
          sortOrder: 0,
        },
      ],
    },
  ],
} satisfies ProfileRecord;

describe('ProfileService', () => {
  const findBySlug = jest.fn<
    ReturnType<ProfileRepository['findBySlug']>,
    Parameters<ProfileRepository['findBySlug']>
  >();
  const repository = { findBySlug } as unknown as ProfileRepository;
  const service = new ProfileService(repository);

  beforeEach(() => {
    findBySlug.mockReset();
  });

  it('maps the stored aggregate to the public GraphQL model', async () => {
    findBySlug.mockResolvedValue(storedProfile);

    await expect(service.getDeveloperProfile()).resolves.toEqual({
      name: 'Aleksey Ermakov',
      headline: 'TypeScript Backend Developer',
      description: 'Profile description',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/realfamousbae',
        },
      ],
      skills: [{ name: 'TypeScript', category: 'Language' }],
      experience: [
        {
          company: 'Independent projects',
          position: 'TypeScript Developer',
          startPeriod: '2025-10',
          endPeriod: null,
          isCurrent: true,
          achievements: ['Delivered a working backend.'],
        },
      ],
      projects: [
        {
          name: 'Hubble',
          description: 'Desktop productivity application',
          url: 'https://github.com/realfamousbae/hubble',
          repositoryUrl: 'https://github.com/realfamousbae/hubble',
          technologies: ['TypeScript'],
        },
      ],
    });
    expect(findBySlug).toHaveBeenCalledWith('aleksey-ermakov');
  });

  it('fails clearly when the database has not been seeded', async () => {
    findBySlug.mockResolvedValue(null);

    await expect(service.getDeveloperProfile()).rejects.toThrow(
      NotFoundException,
    );
  });
});
