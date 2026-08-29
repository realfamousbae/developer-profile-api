import { Controller, Get, Header } from '@nestjs/common';

const landingPage = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aleksey Ermakov — Developer Profile API</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #1f2621; background: #f0eee7; }
      main { width: min(760px, calc(100% - 40px)); margin: 0 auto; padding: 12vh 0 8vh; }
      .eyebrow { margin: 0 0 18px; color: #5b635d; font: 600 12px/1.4 ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }
      h1 { max-width: 680px; margin: 0; font: 500 clamp(44px, 9vw, 86px)/.95 Georgia, serif; letter-spacing: -.045em; }
      .intro { max-width: 590px; margin: 32px 0 0; font-size: clamp(18px, 3vw, 23px); line-height: 1.5; }
      nav { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 36px; }
      a { display: inline-flex; padding: 11px 16px; border: 1px solid #1f2621; color: inherit; text-decoration: none; border-radius: 999px; }
      a.primary { color: #f7f5ee; background: #1f2621; }
      a:hover { transform: translateY(-1px); }
      section { margin-top: 72px; padding-top: 24px; border-top: 1px solid #b9b8b1; }
      h2 { margin: 0 0 16px; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; }
      pre { overflow-x: auto; margin: 0; padding: 20px; color: #e9ede8; background: #28312b; border-radius: 4px; font: 13px/1.6 ui-monospace, monospace; }
      footer { margin-top: 52px; color: #666d68; font-size: 13px; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Developer profile / GraphQL API</p>
      <h1>Aleksey Ermakov</h1>
      <p class="intro">TypeScript backend developer focused on clear service boundaries, reliable data access, and software that is straightforward to run and maintain.</p>
      <nav>
        <a class="primary" href="/graphql">Open Apollo Sandbox</a>
        <a href="/health">Health check</a>
        <a href="https://github.com/realfamousbae">GitHub</a>
      </nav>
      <section>
        <h2>Start with this query</h2>
        <pre>query DeveloperProfile {
  profile {
    name
    description
    skills { name }
    experience { company position achievements }
    projects { name url }
  }
}</pre>
      </section>
      <footer>NestJS · GraphQL · Prisma · CockroachDB · Docker</footer>
    </main>
  </body>
</html>`;

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getLandingPage(): string {
    return landingPage;
  }
}
