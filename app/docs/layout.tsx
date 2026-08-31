import React from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import { BloubAvatar } from '@/components/bloub-avatar';

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <div className="flex items-center gap-2.5 text-[13px] text-foreground tracking-tight group">
            <BloubAvatar size={22} className="shrink-0" />
            <span className="font-medium">Sound Library</span>
          </div>
        ),
        url: '/docs',
      }}
      links={[
        {
          text: 'Catalog',
          url: '/docs/sounds',
        },
        {
          text: 'Guides',
          url: '/docs/guides/react',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/abhi-yo/sound-library',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
