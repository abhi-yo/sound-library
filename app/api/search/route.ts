import { source } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { SOUNDS_METADATA } from '@/components/sound-player';

const SOUND_CATEGORY_ROUTES: Record<string, string> = {
  Interaction: '/docs/sounds/interaction',
  Feedback: '/docs/sounds/feedback',
  Notification: '/docs/sounds/notifications',
  Navigation: '/docs/sounds/navigation',
  System: '/docs/sounds/system',
  'Fun & Essentials': '/docs/sounds/essentials',
};

const UI_COMPONENTS = [
  {
    title: 'SoundStudio (Component)',
    description: 'Interactive DAW-style synthesizer studio with ADSR, envelope controls, and waveform visualizer.',
    url: '/docs/guides/custom-sounds',
    keywords: 'sound studio, synth, daw, adsr, oscillator, web audio, component',
    breadcrumbs: ['Components', 'SoundStudio'],
  },
  {
    title: 'CommandPaletteMockup (Component)',
    description: 'Interactive macOS spotlight/command palette with sound feedback on arrow navigation and action triggers.',
    url: '/docs/sounds/interaction',
    keywords: 'command palette, kbar, cmdk, spotlight, popup, search modal',
    breadcrumbs: ['Components', 'CommandPaletteMockup'],
  },
  {
    title: 'AudioRackMockup (Component)',
    description: 'Hardware synthesizer rack with modular knobs, dial ticks, and LED VU meters.',
    url: '/docs/sounds/interaction',
    keywords: 'audio rack, mixer, knobs, dials, hardware synth',
    breadcrumbs: ['Components', 'AudioRackMockup'],
  },
  {
    title: 'InteractiveOsMockup (Component)',
    description: 'Desktop OS mockup demonstrating system sounds, dock hovers, modal triggers, and window locks.',
    url: '/docs/sounds/system',
    keywords: 'interactive os, desktop, macos, window, dock, system sounds',
    breadcrumbs: ['Components', 'InteractiveOsMockup'],
  },
  {
    title: 'SoundMatrix (Component)',
    description: 'Comprehensive interactive sound matrix grid for rapid auditory preview and parameter inspection.',
    url: '/docs/sounds',
    keywords: 'sound matrix, grid, sampler, trigger pad, sound board',
    breadcrumbs: ['Components', 'SoundMatrix'],
  },
  {
    title: 'SoundShowcase (Component)',
    description: 'Visual showcase grid featuring sound cards, real-time waveform display, and snippet copier.',
    url: '/docs/sounds',
    keywords: 'sound showcase, gallery, cards, audio preview',
    breadcrumbs: ['Components', 'SoundShowcase'],
  },
  {
    title: 'AudioVisualizer (Component)',
    description: 'Real-time Canvas Web Audio frequency and oscilloscope visualizer node.',
    url: '/docs/guides/custom-sounds',
    keywords: 'audio visualizer, oscilloscope, canvas, frequencies, spectrum analyser',
    breadcrumbs: ['Components', 'AudioVisualizer'],
  },
  {
    title: 'SoundCard (Component)',
    description: 'Pre-styled sound preview card with play button, badge, waveform, and copy code button.',
    url: '/docs/sounds',
    keywords: 'sound card, audio card, component, copy code',
    breadcrumbs: ['Components', 'SoundCard'],
  },
  {
    title: 'SoundPlayButton (Component)',
    description: 'Compact inline audio playback button with sound wave animation and AI LLM prompt copier.',
    url: '/docs/sounds/interaction',
    keywords: 'sound play button, audio trigger, prompt button, micro button',
    breadcrumbs: ['Components', 'SoundPlayButton'],
  },
];

// Pre-compute sound and component search indexes once at module evaluation
const staticSoundIndexes = Object.values(SOUNDS_METADATA).map((meta) => {
  const categoryRoute = SOUND_CATEGORY_ROUTES[meta.category] || '/docs/sounds';
  const soundSlug = meta.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    title: `${meta.title} (\`${meta.name}\`)`,
    description: `${meta.description} · ${meta.duration} · ${meta.synthesisType}`,
    url: `${categoryRoute}#${soundSlug}`,
    content: `${meta.title} ${meta.name} ${meta.description} ${meta.synthesisType} ${meta.frequencies} ${meta.category} play${meta.name.replace(/-/g, '')}`,
    keywords: `${meta.name}, ${meta.title}, ${meta.category}, sound, audio, playSound, ${meta.duration}, ${meta.synthesisType}, ${meta.frequencies}`,
    breadcrumbs: ['Sound Catalog', `${meta.category} Sounds`, meta.title],
  };
});

const staticComponentIndexes = UI_COMPONENTS.map((comp) => ({
  title: comp.title,
  description: comp.description,
  url: comp.url,
  content: `${comp.title} ${comp.description} ${comp.keywords}`,
  keywords: comp.keywords,
  breadcrumbs: comp.breadcrumbs,
}));

export const { GET } = createSearchAPI('simple', {
  indexes: () => {
    const pageIndexes = source.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      content: `${page.data.title} ${page.data.description || ''}`,
      keywords: `${page.data.title}, docs, documentation`,
      breadcrumbs: ['Documentation', page.data.title],
    }));

    return [...pageIndexes, ...staticSoundIndexes, ...staticComponentIndexes];
  },
});
