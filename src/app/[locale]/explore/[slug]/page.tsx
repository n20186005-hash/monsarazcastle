import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { entries } from '@/lib/explore';
import { details } from '@/lib/explore-details';
import { management } from '@/lib/explore-management';
import { placeFacts } from '@/lib/explore-facts';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const base = 'https://www.monsarazcastle.com';
const routePhoto:Record<string,number> = {
  'monsaraz-half-day-itinerary':15,
  'monsaraz-one-day-itinerary':4,
  'monsaraz-from-evora':8,
  'monsaraz-parking':6,
  'monsaraz-photography':20,
  'monsaraz-accessibility':14,
  'monsaraz-with-children':18,
};
export function generateStaticParams() { return entries.map(e=>({locale:'en',slug:e.slug})); }

export async function generateMetadata({params}: {params:Promise<{locale:string;slug:string}>}):Promise<Metadata> {
  const {locale,slug}=await params;
  const e=entries.find(e=>e.slug===slug);
  if(!e) return {};
  const dedicatedPhoto=existsSync(join(process.cwd(),'public','explore',slug+'.jpg'));
  const image=dedicatedPhoto?`/explore/${slug}.jpg`:`/gallery/monsaraz-castle-${routePhoto[slug]||1}.jpg`;
  return {title:`${e.title} | Monsaraz Travel Guide`,description:e.lead,alternates:{canonical:`${base}/en/explore/${slug}`},openGraph:{title:e.title,description:e.lead,url:`${base}/en/explore/${slug}`,images:[{url:`${base}${image}`,alt:e.title}]}};
}

export default async function ExploreArticle({params}: {params:Promise<{locale:string;slug:string}>}) {
  const {locale,slug}=await params;
  if (locale !== 'en') redirect(`/en/explore/${slug}`);
  const e=entries.find(e=>e.slug===slug);
  if(!e) notFound();
  const detail=details[e.slug];
  const facts=placeFacts[e.slug];
  const dedicatedPhoto=existsSync(join(process.cwd(),'public','explore',e.slug+'.jpg'));
  const photoSrc=dedicatedPhoto?`/explore/${e.slug}.jpg`:`/gallery/monsaraz-castle-${routePhoto[e.slug]||1}.jpg`;
  const related=entries.filter(x=>x.category===e.category&&x.slug!==slug).slice(0,3);
  const selfUrl=`${base}/${locale}/explore/${slug}`;
  const faq=[
    {q:`Is ${e.title} worth including in a Monsaraz trip?`,a:`Yes if you are interested in ${e.category.toLowerCase()}. ${e.lead} ${e.experience}`},
    {q:`How should I plan a visit to ${e.title}?`,a:e.practical},
    {q:`What can I combine with ${e.title}?`,a:e.route},
    {q:`Where are the best views or details at ${e.title}?`,a:detail.photo},
  ];
  const structured={'@context':'https://schema.org','@graph':[
    {'@type':e.category==='Planning'||e.slug==='what-to-eat-monsaraz'?'WebPage':'TouristAttraction',name:e.title,description:e.lead,url:selfUrl,...(e.category==='Planning'||e.slug==='what-to-eat-monsaraz'?{}:{containedInPlace:{'@type':'Place',name:'Reguengos de Monsaraz, Alentejo, Portugal'}})},
    {'@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:'Monsaraz Castle',item:`${base}/${locale}`},{'@type':'ListItem',position:2,name:'Explore Monsaraz',item:`${base}/${locale}/explore`},{'@type':'ListItem',position:3,name:e.title,item:selfUrl}]},
    {'@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}
  ]};
  return <main className="max-w-4xl mx-auto px-5 py-14 sm:py-20" style={{color:'var(--text-primary)'}}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}} />
    <nav className="text-sm flex flex-wrap gap-2" style={{color:'var(--accent)'}}><Link href={`/${locale}`}>Monsaraz Castle</Link><span>›</span><Link href={`/${locale}/explore`}>Explore</Link><span>›</span><span>{e.category}</span></nav>
    <p className="uppercase tracking-widest text-xs font-semibold mt-10" style={{color:'var(--accent)'}}>{e.category} · Alentejo, Portugal</p>
    <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3 leading-tight">{e.title}</h1>
    <p className="text-xl leading-relaxed mt-5" style={{color:'var(--text-secondary)'}}>{e.lead}</p>
    <div className="mt-5 flex flex-wrap gap-2 text-sm"><span className="px-3 py-1.5 rounded-full" style={{background:'var(--bg-tertiary)'}}>{facts.kind}</span><span className="px-3 py-1.5 rounded-full" style={{background:'var(--bg-tertiary)'}}>{facts.area}</span></div>
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6 px-5 py-3 rounded-lg font-semibold text-white" style={{background:'var(--accent)'}}>View this place on Google Maps ↗</a>
    <figure className="mt-10"><Image src={photoSrc} alt={dedicatedPhoto?`Real photograph illustrating ${e.title} in Alentejo, Portugal`:'Monsaraz Castle — real photograph illustrating this visitor itinerary'} width={1000} height={750} className="w-full h-auto max-h-[520px] object-cover rounded-2xl"/><figcaption className="text-xs mt-2" style={{color:'var(--text-muted)'}}>{dedicatedPhoto?`${e.title} · relevant real-location photograph`:'Monsaraz Castle · real photograph of a route landmark'}</figcaption></figure>
    <section className="mt-11"><h2 className="font-display text-2xl font-semibold">Discover {e.title}</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.experience}</p><h3 className="font-semibold text-lg mt-7">Visitor tips</h3><p className="mt-2 leading-8" style={{color:'var(--text-secondary)'}}>{e.practical}</p></section>
    <section className="rounded-xl p-6 mt-10" style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)'}}><h2 className="font-display text-2xl font-semibold">About {e.title}</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{management[e.slug]}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.background}</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Essential visitor information</h2><dl className="mt-5 rounded-xl overflow-hidden" style={{border:'1px solid var(--border-color)'}}>
      {([['Site or experience',facts.kind],['Location',`${facts.area}, Portugal`],['Region','Alentejo, Portugal'],['Current access',facts.access],['Admission and costs',facts.cost],['Overnight base',facts.stay]] as const).map(([label,value])=><div key={label} className="grid sm:grid-cols-[190px_1fr] gap-2 sm:gap-5 p-4" style={{borderBottom:'1px solid var(--border-color)'}}><dt className="font-semibold text-sm" style={{color:'var(--text-primary)'}}>{label}</dt><dd className="text-sm leading-7" style={{color:'var(--text-secondary)'}}>{value}</dd></div>)}
    </dl></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Highlights and what to notice</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.experience}</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">History, design and distinctive features</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{detail.architecture}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>The setting is part of the story: compare this stop with the fortified village of Monsaraz and the countryside beyond. The relationship between the buildings, paths and terrain often reveals more than a quick photograph of a single landmark.</p></section>
    <section className="mt-12 grid sm:grid-cols-2 gap-4"><div className="rounded-xl p-5" style={{background:'var(--bg-tertiary)'}}><h2 className="font-display text-xl font-semibold">Opening hours & access</h2><p className="mt-3 leading-relaxed" style={{color:'var(--text-secondary)'}}>{facts.access} Check the current site notice or responsible venue before setting out.</p></div><div className="rounded-xl p-5" style={{background:'var(--bg-tertiary)'}}><h2 className="font-display text-xl font-semibold">Tickets & prices</h2><p className="mt-3 leading-relaxed" style={{color:'var(--text-secondary)'}}>{facts.cost} Booked experiences, exhibitions and optional services may have separate charges.</p></div></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Before you go</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.practical}</p><ul className="list-disc pl-6 mt-4 space-y-2" style={{color:'var(--text-secondary)'}}><li>Confirm opening conditions, road access and event restrictions locally before travel.</li><li>Take water and comfortable shoes, especially in warmer months.</li><li>Respect residents, religious spaces, archaeological remains and protected landscapes.</li></ul></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Suggested route and nearby stops</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{e.route}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>Use the place-specific map link above to check your starting point and current route. Travel times depend on where you park and on local road or footpath conditions.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Getting here and moving around</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{detail.access}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>If travelling from Évora or Reguengos de Monsaraz, check current public transport connections before relying on them. For rural monuments and waterside activities, a car, taxi or arranged excursion is often more practical than an unplanned walk from the castle.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">A simple three-step visit</h2><ol className="list-decimal pl-6 mt-5 space-y-4 leading-8" style={{color:'var(--text-secondary)'}}><li><strong>Orient yourself.</strong> Open the specific Google Maps search above and approach via the permitted entrance or public route.</li><li><strong>Explore deliberately.</strong> {e.experience}</li><li><strong>Continue onward.</strong> {e.route}</li></ol></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Photography spots and best light</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{detail.photo}</p><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>Morning and late-afternoon light can bring out the textures of Alentejo stone and countryside. Keep paths clear for other visitors, ask permission before photographing people and never cross barriers for a better angle.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Where to stay nearby</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>{facts.stay}. For early sightseeing or night photography, staying close to the destination can reduce driving. Compare the property’s parking, check-in arrangements and accessibility with your planned route before booking.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Visitor impressions and what to expect</h2><p className="mt-4 leading-8" style={{color:'var(--text-secondary)'}}>The appeal of this stop lies in its setting and the details worth noticing: {e.experience} For recent visitor reviews, photographs and practical access updates, open the place-specific Google Maps link above.</p></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2><div className="space-y-5 mt-5">{faq.map(f=><div key={f.q} className="rounded-xl p-5" style={{background:'var(--bg-tertiary)'}}><h3 className="font-semibold">{f.q}</h3><p className="mt-2 leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.a}</p></div>)}</div></section>
    <section className="mt-12"><h2 className="font-display text-2xl font-semibold">Continue exploring</h2><div className="grid sm:grid-cols-3 gap-4 mt-5">{related.map(x=><Link href={`/${locale}/explore/${x.slug}`} key={x.slug} className="p-4 rounded-lg hover:underline" style={{background:'var(--bg-tertiary)',color:'var(--accent)'}}>{x.title} →</Link>)}</div><Link className="inline-block mt-6 underline" href={`/${locale}/explore`}>All Monsaraz visitor guides</Link></section>
    <p className="mt-12 text-xs leading-relaxed" style={{color:'var(--text-muted)'}}>Sources for local context: <a className="underline" href="https://www.visitportugal.com/en/destinos/alentejo/483307" target="_blank" rel="noopener noreferrer">Visit Portugal</a> and <a className="underline" href="https://www.cm-reguengos-monsaraz.pt/" target="_blank" rel="noopener noreferrer">Reguengos de Monsaraz Municipality</a>. Confirm visit-specific arrangements with the relevant operator.</p>
  </main>;
}
