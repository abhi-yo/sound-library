'use client';
import { AlignJustify, Component, Layout, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Drawer } from 'vaul';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { BloubAvatar } from '@/components/bloub-avatar';

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
      <title>X</title>
      <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
    </svg>
  );
}

export default function HomeHeader() {
  const isMobile = useMediaQuery('(max-width: 992px)');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/docs', label: 'Documentation', icon: Component },
    { href: '/docs/sounds', label: 'Catalog', icon: Layout },
    { href: 'https://github.com/abhi-yo/sound-library', label: 'GitHub', icon: Wallet },
  ];

  return (
    <header className='w-full top-0 z-10 absolute lg:z-10 lg:flex lg:items-center lg:px-8 lg:py-0 text-primary-foreground'>
      <div className='flex md:max-w-6xl mx-auto w-full items-center relative justify-between h-16 px-4 p-2 bg-background border dark:border-neutral-800 border-neutral-200 rounded-b-xl dark:bg-zinc-950 shadow-sm'>
        {isMobile && (
          <Drawer.Root direction='left' open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className='px-3 text-white h-10 grid place-content-center bg-linear-to-b from-blue-500 from-100% to-blue-700 w-fit rounded-lg'>
              <AlignJustify />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className='fixed inset-0 bg-black/40 z-50' />
              <Drawer.Content
                className='left-2 top-2 bottom-2 fixed z-50 outline-hidden w-72 flex'
                style={
                  {
                    '--initial-transform': 'calc(100% + 8px)',
                  } as React.CSSProperties
                }
              >
                <div className='dark:bg-black bg-white border border-neutral-200 dark:border-neutral-800 p-2 h-full w-full grow flex flex-col rounded-[16px]'>
                  <div className='w-full flex justify-between mb-2'>
                    <a href='/' className='flex items-center pl-2'>
                      <div className='text-zinc-950 dark:text-white flex gap-2 items-center'>
                        <BloubAvatar size={28} />
                      </div>
                    </a>
                    <button
                      className='rounded-md w-fit bg-neutral-950 px-3 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-neutral-800 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                      onClick={() => setIsOpen(false)}
                    >
                      <X />
                    </button>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'cursor-pointer gap-1 select-none p-2 dark:hover:text-blue-200 hover:text-base-blue rounded-md transition-colors duration-200 flex items-center justify-start',
                        pathname.startsWith(item.href) &&
                          'dark:text-blue-200 dark:border dark:border-blue-950 text-base-blue dark:bg-neutral-900 bg-neutral-200'
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
        {!isMobile && (
          <>
            <nav className='flex gap-2 items-center font-medium'>
              <a href='/' className='flex items-center pl-2 mr-6'>
                <div className='text-zinc-950 dark:text-white flex gap-3 items-center'>
                  <BloubAvatar size={26} className="shrink-0" />
                  <span className="text-sm font-semibold tracking-tight text-foreground">Sound Library</span>
                </div>
              </a>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'cursor-pointer gap-1 select-none px-3 py-2 dark:hover:text-blue-200 hover:text-blue-600 text-foreground dark:text-white rounded-md transition-colors duration-200 flex items-center justify-center text-sm',
                    pathname.startsWith(item.href) &&
                      'dark:text-blue-200 dark:border dark:border-blue-950 text-blue-600 dark:bg-neutral-900 bg-neutral-200'
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </>
        )}
        <nav className='flex items-center gap-2'>
          <a
            href='https://twitter.com/abhi_yo'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex h-9 border dark:border-neutral-800 border-neutral-200 px-3 rounded-md items-center justify-center'
          >
            <XIcon className='h-4 w-4 fill-zinc-950 dark:fill-white' />
          </a>
          <ThemeToggle />
          <Link
            href='/docs/sounds'
            className='bg-[#334cec] text-white hover:bg-[#293cc0] transition-colors border dark:border-neutral-800 border-neutral-200 h-9 items-center flex justify-center px-4 rounded-md text-sm font-medium'
          >
            Start Auditioning
          </Link>
        </nav>
      </div>
    </header>
  );
}
