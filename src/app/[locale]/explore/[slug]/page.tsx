import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { entries } from '@/lib/explore';

const base = 'https://www.monsarazcastle.com';
export function generateStaticParams() { return entries.map(e=>({locale:'en',slug:e.slug})); }

export async function generateMetadata({params}: {params:Promise<{locale:string;slug:string}>}):Promise<Metadata> {
  const {locale,slug}=await params;
  const e=entries.find(e=>e.slug===slug);
  if(!e) return {};
  return {title:`${e.title} | Monsaraz Travel Guide`,description:e.lead,alternates:{canonical:`${base}/en/explore/${slug}`},openGraph:{title:e.title,description:e.lead,url:`${base}/en/explore/${slug}`,images:[`${base}/gallery/monsaraz-castle-1.jpg`]}};
}

export default async function ExploreArticle({params}: {params:Promise<{locale:string;slug:string}>}) {
  const {locale,slug}=await params;
  if (locale !== 'en') redirect(`/en/explore/${slug}`);
  const e=entries.find(e=>e.slug===slug);
  if(!e) notFound();
  const related=entries.filter(x=>x.category===e.category&&x.slug!==slug).slice(0,3);
  const selfUrl=`${base}/${locale}/explore/${slug}`;
  const faq=[
    {q:`Is ${e.title} worth including in a Monsaraz trip?`,a:`Yes if you are interested in ${e.category.toLowerCase()}. ${e.lead} ${e.experience}`},
    {q:`How should I plan a visit to ${e.title}?`,a:e.practical},
    {q:`What can I combine with ${e.title}?`,a:e.route},
  ];
  const structured={'@context':'https://schema.org','@graph':[
    {'@type':'TouristAttraction',name:e.title,description:e.lead,url:selfUrl,containedInPlace:{'@type':'Place',name:'Reguengos de Monsaraz, Alentejo, Portugal'}},
    {'@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:'Monsaraz Castle',item:`${base}/${locale}`},{'@type':'ListItem',position:2,name:'Explore Monsaraz',item:`${base}/${locale}/explore`},{'@type':'ListItem',position:3,name:e.title,item:selfUrl}]},
    {'@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}
  ]};
  return <main className="max-w-4xl mx-auto px-5 py-14 sm:py-20" style={{color:'var(--text-primary)'}}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}} />
    <nav className="text-sm flex flex-wrap gap-2" style={{color:'var(--accent)'}}><Link href={`/${locale}`}>Monsaraz Castle</Link><span>›</span><Link href={`/${locale}/explore`}>Explore</Link><span>›</span><span>{e.category}</span></nav>
    <p className="uppercase tracking-widest text-xs font-semibold mt-10" style={{color:'var(--accent)'}}>{e.category} · Alentejo, Portugal</p>
    <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3 leading-tight">{e.title}</h1>
    <p className="text-xl leading-relaxed mt-5" style={{color:'var(--text-secondary)'}}>{e.lead}</p>
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6 px-5 py-3 rounded-lg font-semibold text-white" style={{background:'var(--accent)'}}>View this place on Google Maps ↗</a>
    <figure className="mt-10"><Image src="/gallery/monsaraz-castle-1.jpg" alt="Monsaraz Castle and the surrounding Alentejo landscape — regional context photograph" width={1600} height={1200} className="w-full h-auto max-h-[420px] object-cover rounded-2xl"/><figcaption className="text-xs mt-2" style={{color:'var(--text-muted)'}}>Monsaraz Castle and regional landscape. Context photograph; it does not necessarily depict the specific attraction described.</figcaption></figure>
    <section className="rounded-xl p-6 mt-10" style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)'}}><h2 className="font-display text-2xl font-semibold">About {e.title}</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.background}</p><p className="mt-4 text-sm" style={{color:'var(--text-muted)'}}>Local heritage and visitor facilities fall under the relevant municipal, parish, heritage or individual site operators. For site-specific access and management information, consult the municipality of Reguengos de Monsaraz or the venue directly.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Highlights and what to notice</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.experience}</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Before you go</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.practical}</p><ul className="list-disc pl-6 mt-4 space-y-2" style={{color:'var(--text-secondary)'}}><li>Confirm opening conditions, road access and event restrictions locally before travel.</li><li>Take water and comfortable shoes, especially in warmer months.</li><li>Respect residents, religious spaces, archaeological remains and protected landscapes.</li></ul></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Suggested route and nearby stops</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.route}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>Use the place-specific map link above to check your starting point and current route. Travel times depend on where you park and on local road or footpath conditions.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Photography and visitor etiquette</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>Morning and late-afternoon light can bring out the textures of Alentejo stone and countryside. Keep paths clear for other visitors, ask permission before photographing people and never cross barriers for a better angle. In summer, the brightest midday light coincides with the greatest heat.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2><div className="space-y-5 mt-5">{faq.map(f=><div key={f.q} className="rounded-xl p-5" style={{background:'var(--bg-tertiary)'}}><h3 className="font-semibold">{f.q}</h3><p className="mt-2 leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.a}</p></div>)}</div></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Continue exploring</h2><div className="grid sm:grid-cols-3 gap-4 mt-5">{related.map(x=><Link href={`/${locale}/explore/${x.slug}`} key={x.slug} className="p-4 rounded-lg hover:underline" style={{background:'var(--bg-tertiary)',color:'var(--accent)'}}>{x.title} →</Link>)}</div><Link className="inline-block mt-6 underline" href={`/${locale}/explore`}>All Monsaraz visitor guides</Link></section>
    <p className="mt-12 text-xs leading-relaxed" style={{color:'var(--text-muted)'}}>Sources for local context: <a className="underline" href="https://www.visitportugal.com/en/destinos/alentejo/483307" target="_blank" rel="noopener noreferrer">Visit Portugal</a> and <a className="underline" href="https://www.cm-reguengos-monsaraz.pt/" target="_blank" rel="noopener noreferrer">Reguengos de Monsaraz Municipality</a>. Confirm visit-specific arrangements with the relevant operator.</p>
  </main>;
}
