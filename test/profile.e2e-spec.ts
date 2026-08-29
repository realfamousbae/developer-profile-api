import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';

import { AppModule } from '../src/app.module';

const profileQuery = String.raw`
  query DeveloperProfile {
    profile {
      name
      description
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

    expect(response.body as unknown).toEqual({
      data: {
        profile: {
          name: 'Aleksey Ermakov',
          description:
            'I build maintainable TypeScript services with clear boundaries, predictable data access, and reproducible development environments.',
          skills: [
            { name: 'TypeScript' },
            { name: 'Node.js' },
            { name: 'NestJS' },
            { name: 'GraphQL' },
            { name: 'Prisma ORM' },
            { name: 'CockroachDB' },
            { name: 'PostgreSQL' },
            { name: 'Docker' },
            { name: 'Git' },
          ],
          experience: [
            {
              company: 'Independent and team projects',
              position: 'TypeScript Developer',
            },
          ],
          projects: [
            {
              name: 'Hubble',
              url: 'https://github.com/realfamousbae/hubble',
            },
            {
              name: 'Ploom',
              url: 'https://ploom-front.vercel.app',
            },
            {
              name: 'Focus',
              url: 'https://github.com/realfamousbae/realfamousbae-focus',
            },
          ],
        },
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
