# Developer Profile API

A read-only GraphQL API that presents Aleksey Ermakov's professional profile, skills, experience, and selected projects. It is built as a small production-style NestJS service: data lives in CockroachDB, Prisma owns the persistence boundary, and Docker prepares the complete application from an empty environment.

## Live API

- Apollo Sandbox: [developer-profile-api.vercel.app/graphql](https://developer-profile-api.vercel.app/graphql)
- Landing page: [developer-profile-api.vercel.app](https://developer-profile-api.vercel.app)
- Health check: [developer-profile-api.vercel.app/health](https://developer-profile-api.vercel.app/health)

## Quick start

Docker is the only prerequisite.

```bash
docker compose up --build
```

Once all services are healthy:

- Apollo Sandbox: [http://localhost:3000/graphql](http://localhost:3000/graphql)
- Landing page: [http://localhost:3000](http://localhost:3000)
- Health check: [http://localhost:3000/health](http://localhost:3000/health)
- Local CockroachDB console: [http://localhost:8080](http://localhost:8080)

The first startup follows a deterministic sequence:

```text
CockroachDB healthy
        ↓
apply committed migrations
        ↓
run idempotent profile seed
        ↓
start the NestJS API
```

The database is stored in a named Docker volume. To test a genuinely clean startup later, remove that project volume and rebuild:

```bash
docker compose down --volumes
docker compose up --build
```

## GraphQL API

The query from the assignment works without modification:

```graphql
query {
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
```

A more complete query is available in Apollo Sandbox:

```graphql
query DeveloperProfile {
  profile {
    name
    headline
    description
    links {
      label
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      startPeriod
      endPeriod
      isCurrent
      achievements
    }
    projects {
      name
      description
      url
      repositoryUrl
      technologies
    }
  }
}
```

The schema is intentionally read-only. A digital business card has no public write use case, so mutations and authentication would increase the API surface without improving the assignment.

## Architecture

```text
GraphQL resolver
      ↓
Profile service       maps the stored aggregate to the public API model
      ↓
Profile repository    owns the ordered relational query
      ↓
Prisma service        manages the database client lifecycle
      ↓
CockroachDB
```

The repository loads the profile and every ordered relation in one query. This avoids N+1 queries while keeping database details out of the resolver. Persistence models are normalized around skills, professional links, experience achievements, projects, and project technologies.

Employment periods use `YYYY-MM` strings because the source data has month precision. Treating those values as timestamps would introduce a false day and timezone behavior that the domain does not need.

The seed is safe to run repeatedly. It updates the profile identified by its stable slug and replaces only that profile's owned relations inside a transaction, so it neither duplicates entries nor affects unrelated profiles.

## Project structure

```text
prisma/
  migrations/          versioned CockroachDB schema changes
  schema.prisma        persistence model
  seed.ts              repeatable database initialization
src/
  database/            Prisma lifecycle and connection setup
  health/              database-aware readiness endpoint
  profile/             GraphQL model, resolver, service, and repository
test/                   end-to-end API checks
```

## Development without the application container

Node.js 22 and Docker are required.

```bash
cp .env.example .env
docker compose up --detach database
npm ci
npm run db:migrate
npm run db:seed
npm run start:dev
```

Useful commands:

```bash
npm run check          # formatting, lint, types, unit tests, and build
npm run test:e2e       # GraphQL and health checks against a prepared database
npm run db:seed        # safe to repeat
```

## Deployment

The production API runs as a Vercel Function in Frankfurt, close to its CockroachDB Cloud region. The application keeps the standard NestJS entry point supported by Vercel and needs one environment variable:

```text
DATABASE_URL=<CockroachDB Cloud connection string>
```

The `vercel-build` script generates Prisma Client, applies committed migrations, runs the idempotent seed, and compiles NestJS. Database changes are therefore performed during deployment rather than during a serverless request or cold start.

Docker is deliberately a local and CI concern; CockroachDB itself should run in CockroachDB Cloud for the public Vercel deployment. The insecure single-node database in `docker-compose.yml` is only for local development.

## Quality checks

GitHub Actions runs the same source checks as local development, starts a real CockroachDB container, applies migrations, executes the seed twice, and then runs the end-to-end GraphQL tests. This verifies both clean initialization and seed idempotency rather than substituting PostgreSQL or an in-memory database.

## Technology

TypeScript · Node.js · NestJS · GraphQL · Apollo Server · Prisma ORM · CockroachDB · Docker · GitHub Actions

## License

[MIT](LICENSE)
