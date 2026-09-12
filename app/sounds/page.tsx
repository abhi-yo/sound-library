import { redirect } from 'next/navigation';

/** Canonical catalog lives in docs; keep a short URL. */
export default function SoundsPage() {
  redirect('/docs/sounds');
}
