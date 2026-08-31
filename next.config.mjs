import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: __dirname,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'fumadocs-ui',
      'fumadocs-core',
      '@radix-ui/react-accordion',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid eval()-based source maps that cause OOM on large modules
      // like lib/sounds.ts (39KB switch statement)
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
