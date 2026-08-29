import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';

import { developerProfile } from '../prisma/seed-data.ts';
import { AppModule } from '../src/app.module.ts';

const profileQuery = String.raw`
  query DeveloperProfile {
    profile {
      name
      description
      links {
        label
        url
      }
      skills {
        name
      }
      experience {
        company
        position
      }
      projects {
        name
        url
      }
    }
  }
`;

describe('Developer profile API', () => {
  let app: INestApplication | undefined;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns the complete nested profile requested by the assignment', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({ query: profileQuery })
      .expect(200);

    const expectedProfile = {
      name: developerProfile.name,
      description: developerProfile.description,
      links: developerProfile.professionalLinks.map(({ label, url }) => ({
        label,
        url,
      })),
      skills: developerProfile.skills.map(({ name }) => ({ name })),
      experience: developerProfile.experiences.map(({ company, position }) => ({
        company,
        position,
      })),
      projects: developerProfile.projects.map(({ name, url }) => ({
        name,
        url,
      })),
    };

    expect(response.body as unknown).toEqual({
      data: {
        profile: expectedProfile,
      },
    });
  });

  it('reports database readiness', async () => {
    const response = await request(server).get('/health').expect(200);
    const responseBody = response.body as {
      status: unknown;
      database: unknown;
      checkedAt: unknown;
    };

    expect(responseBody.status).toBe('ok');
    expect(responseBody.database).toBe('reachable');
    expect(typeof responseBody.checkedAt).toBe('string');
  });
});
