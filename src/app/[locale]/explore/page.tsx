import Link from 'next/link';
import type { Metadata } from 'next';
import { entries } from '@/lib/explore';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Explore Monsaraz: Attractions, Routes & Visitor Guides',
  description: 'Discover 31 detailed guides to Monsaraz historic sights, Alqueva viewpoints, megalithic sites, local crafts and practical travel plans.',
  alternates: {canonical:'https://www.monsarazcastle.com/en/explore'},
};

export default async function ExploreIndex({params}: {params: Promise<{locale:string}>}) {
  const {locale} = await params;
  if (locale !== 'en') redirect('/en/explore');
  const groups = [...new Set(entries.map(e => e.category))];
  return <main className="max-w-5xl mx-auto px-5 py-14 sm:py-20" style={{color:'var(--text-primary)'}}>
    <Link href={`/${locale}`} className="text-sm hover:underline" style={{color:'var(--accent)'}}>← Monsaraz Castle</Link>
    <h1 className="font-display text-4xl sm:text-5xl font-bold mt-8">Explore Monsaraz & Alqueva</h1>
    <p className="text-lg mt-5 max-w-3xl leading-relaxed" style={{color:'var(--text-secondary)'}}>Explore the medieval village, its nearby prehistoric monuments and Lake Alqueva, then build a realistic itinerary. These guides explain what makes each stop interesting, what to look for and how to plan your visit.</p>
    {groups.map(group => <section key={group} className="mt-12"><h2 className="font-display text-2xl font-semibold mb-5">{group}</h2><div className="grid sm:grid-cols-2 gap-4">{entries.filter(e=>e.category===group).map(e=><Link key={e.slug} href={`/${locale}/explore/${e.slug}`} className="block rounded-xl p-5 transition-opacity hover:opacity-80" style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)'}}><h3 className="font-semibold text-lg">{e.title}</h3><p className="text-sm mt-2 leading-relaxed" style={{color:'var(--text-secondary)'}}>{e.lead}</p><span className="text-sm inline-block mt-3" style={{color:'var(--accent)'}}>Read guide →</span></Link>)}</div></section>)}
    <p className="mt-12 text-sm" style={{color:'var(--text-muted)'}}>For opening times, visitor arrangements and restricted areas, check notices at the attraction and the municipality of Reguengos de Monsaraz.</p>
  </main>;
}
