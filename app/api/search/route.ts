import { NextResponse } from 'next/server';
import { SOUNDS_METADATA } from '@/lib/sounds-metadata';

const DOCS_INDEX = [
  {
    title: 'Overview',
    description: 'Zero-dependency synthesized audio primitives for React, Vue, Svelte, and vanilla web applications.',
    url: '/docs',
    category: 'Getting Started',
  },
  {
    title: 'Quick Start',
    description: 'Get started with sound-library in less than two minutes. Install, initialize, and trigger your first sound.',
    url: '/docs/quick-start',
    category: 'Getting Started',
  },
  {
    title: 'React / Next.js',
    description: 'First-class hooks, providers, and component integrations tailored for modern React and Next.js applications.',
    url: '/docs/react',
    category: 'Frameworks',
  },
  {
    title: 'TypeScript',
    description: 'Comprehensive type safety, sound key auto-complete, parameter inference, and engine interfaces.',
    url: '/docs/typescript',
    category: 'Core',
  },
  {
    title: 'CLI Generator',
    description: 'Scaffold sound themes, export raw audio presets, and test synthesizers directly in your terminal.',
    url: '/docs/cli',
    category: 'Tooling',
  },
  {
    title: 'LLM & AI Integration',
    description: 'System prompts, markdown specs, and context files for Cursor, Claude, GitHub Copilot, and ChatGPT.',
    url: '/docs/llms',
    category: 'AI & Tools',
  },
  {
    title: 'Sound Catalog',
    description: 'Explore 50+ synthesized sounds across Interaction, Feedback, Notification, Navigation, and System categories.',
    url: '/docs/sounds',
    category: 'Catalog',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').toLowerCase().trim();

  const soundResults = Object.values(SOUNDS_METADATA)
    .filter(
      (sound) =>
        !query ||
        sound.title.toLowerCase().includes(query) ||
        sound.name.toLowerCase().includes(query) ||
        sound.category.toLowerCase().includes(query) ||
        sound.description.toLowerCase().includes(query)
    )
    .map((sound) => ({
      title: sound.title,
      description: sound.description,
      url: `/docs/sounds#${sound.name}`,
      category: `${sound.category} Sound`,
    }));

  const docResults = DOCS_INDEX.filter(
    (doc) =>
      !query ||
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query)
  );

  return NextResponse.json({
    results: [...docResults, ...soundResults].slice(0, 20),
  });
}
