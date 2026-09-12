import React from 'react';
import HomePage from '@/components/home-page';

/**
 * Server Component shell — keeps the route entry light.
 * Heavy Originkit / demo islands live in the client HomePage via next/dynamic.
 */
export default function Home() {
  return <HomePage />;
}
