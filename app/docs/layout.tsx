import React from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import { BloubAvatar } from '@/components/bloub-avatar';
import { SidebarClickSound } from '@/components/sidebar-click-sound';

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout
      tree={source.pageTree}
      themeSwitch={{
        enabled: false,
      }}
      nav={{
        title: (
          <div className="flex items-center gap-2.5 group font-helvetica-neue select-none">
            <BloubAvatar size={24} className="shrink-0 transition-transform group-hover:scale-105" />
            <span className="font-medium text-[16px] tracking-[-0.3px] text-white leading-none">
              sound bits
            </span>
          </div>
        ),
        url: '/docs',
      }}
      sidebar={{
        collapsible: true,
      }}
      links={[
        {
          text: 'Catalog',
          url: '/docs/sounds',
        },
        {
          text: 'AI agents',
          url: '/docs/skills',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/abhi-yo/sound-library',
          external: true,
        },
      ]}
    >
      <SidebarClickSound />
      {children}
    </DocsLayout>
  );
}
