import { SoundsGallery } from '@/components/sounds-gallery';
import { UsageGuide } from '@/components/usage-guide';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata = {
  title: 'UI Sound Effects Library',
  description: 'Tiny audio interactions for web apps. Button clicks, hover blips, success sounds, and error feedback.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex flex-col gap-12 px-4 py-12 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
              Sound Effects
            </h1>
            <ThemeToggle />
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Micro UX audio for interactive web applications. Click to preview, copy code to use.
          </p>
        </div>

        {/* Gallery */}
        <SoundsGallery />

        {/* Usage Guide */}
        <UsageGuide />

        {/* Footer */}
        <div className="border-t border-border py-8 text-center text-sm text-muted-foreground">
          <p>Click the play button to preview. Use the copy button to get code for your project.</p>
        </div>
      </div>
    </main>
  );
}
