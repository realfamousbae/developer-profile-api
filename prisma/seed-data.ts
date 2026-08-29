export const developerProfile = {
  slug: 'aleksey-ermakov',
  name: 'Aleksey Ermakov',
  headline: 'TypeScript Backend Developer',
  description:
    'I build maintainable TypeScript services with clear boundaries, predictable data access, and reproducible development environments.',
  professionalLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/realfamousbae',
    },
  ],
  skills: [
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'GraphQL', category: 'API' },
    { name: 'Prisma ORM', category: 'Data' },
    { name: 'CockroachDB', category: 'Data' },
    { name: 'PostgreSQL', category: 'Data' },
    { name: 'Docker', category: 'Infrastructure' },
    { name: 'Git', category: 'Tooling' },
  ],
  experiences: [
    {
      company: 'Independent and team projects',
      position: 'TypeScript Developer',
      startPeriod: '2025-10',
      endPeriod: null,
      isCurrent: true,
      achievements: [
        'Owned backend delivery for a four-person product team, from API design to external AI service integration.',
        'Built and shipped web and desktop products across Node.js, React, Tauri, and cloud-hosted data platforms.',
        'Used Git-based workflows and automated validation to keep project changes reproducible.',
      ],
    },
  ],
  projects: [
    {
      name: 'Hubble',
      description:
        'A cross-platform desktop productivity application migrated from Electron to Tauri 2 for a smaller runtime footprint and native packaging.',
      url: 'https://github.com/realfamousbae/hubble',
      repositoryUrl: 'https://github.com/realfamousbae/hubble',
      technologies: ['TypeScript', 'Tauri 2', 'Rust', 'React'],
    },
    {
      name: 'Ploom',
      description:
        'A team-built service for creating personalized 3D souvenirs with AI. I owned the backend API, file handling, and AI service integration.',
      url: 'https://ploom-front.vercel.app',
      repositoryUrl: 'https://github.com/realfamousbae/ploom-backend',
      technologies: ['TypeScript', 'Node.js', 'Express', 'SQLite'],
    },
    {
      name: 'Focus',
      description:
        'A privacy-focused web application for creating countdowns and synchronizing them across devices with calendar import support.',
      url: 'https://github.com/realfamousbae/realfamousbae-focus',
      repositoryUrl: 'https://github.com/realfamousbae/realfamousbae-focus',
      technologies: ['TypeScript', 'Next.js', 'React', 'Cloudflare D1'],
    },
  ],
} as const;
