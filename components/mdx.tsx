import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { CodeBlock } from '@/components/docs/code-block';
import { SoundPlayButton } from '@/components/mdx-client';

function CompactCards({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={`not-prose grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CompactCard({
  title,
  description,
  href,
  children,
  className,
  ...props
}: {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const content = (
    <>
      <div className="text-sm font-semibold text-fd-foreground tracking-tight">{title}</div>
      {description && <div className="text-xs text-fd-muted-foreground mt-1 leading-normal">{description}</div>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`block rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5 transition-all hover:bg-fd-accent/50 hover:border-fd-border no-underline ${className || ''}`}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={`rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5 transition-colors ${className || ''}`}
      {...props}
    >
      {content}
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return '';
}

function MdxPre(props: React.ComponentProps<'pre'> & { children?: React.ReactNode }) {
  const { children } = props;
  let rawCode = '';
  let language = '';
  let filename: string | undefined;

  if (React.isValidElement(children)) {
    const codeProps = children.props as any;
    rawCode = extractText(codeProps?.children);
    const className = codeProps?.className || props.className || '';
    const match = /language-([a-zA-Z0-9_-]+)/.exec(className);
    if (match) language = match[1];
    filename = codeProps?.['data-filename'] || codeProps?.title;
  } else {
    rawCode = extractText(children);
  }

  if (rawCode && rawCode.trim()) {
    const trimmed = rawCode.trim();
    const isPkgInstall =
      (trimmed.includes('npm install') ||
        trimmed.includes('pnpm add') ||
        trimmed.includes('bun add') ||
        trimmed.includes('yarn add')) &&
      !trimmed.includes('import ') &&
      !trimmed.includes('export ');

    if (isPkgInstall) {
      return (
        <div className="not-prose my-4">
          <CodeBlock isPackageManager={true} packageName="sound-library" />
        </div>
      );
    }

    const isShell =
      language === 'bash' ||
      language === 'sh' ||
      language === 'shell' ||
      trimmed.startsWith('npx ') ||
      trimmed.startsWith('npm ') ||
      trimmed.startsWith('pnpm ') ||
      trimmed.startsWith('bun ');

    const finalLanguage = language || (isShell ? 'bash' : 'tsx');
    const isSingleLine = !trimmed.includes('\n');

    return (
      <div className="not-prose my-4">
        <CodeBlock
          code={trimmed}
          language={finalLanguage}
          filename={filename}
          showLineNumbers={!isShell && !isSingleLine}
          showHeader={!!filename}
        />
      </div>
    );
  }

  const DefaultPre = defaultMdxComponents.pre as any;
  return DefaultPre ? <DefaultPre {...props}>{children}</DefaultPre> : <pre {...props}>{children}</pre>;
}

export function getMDXComponents() {
  return {
    ...defaultMdxComponents,
    pre: MdxPre,
    CodeBlock,
    Callout,
    Tab,
    Tabs,
    Step,
    Steps,
    Card: CompactCard,
    Cards: CompactCards,
    TypeTable,
    Accordion,
    Accordions,
    SoundPlayButton,
    SoundActions: SoundPlayButton,
  } as any;
}
