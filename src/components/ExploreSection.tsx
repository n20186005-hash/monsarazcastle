import Link from 'next/link';
import Image from 'next/image';

const textByLocale: Record<string, {eyebrow:string;title:string;intro:string;all:string;language:string}> = {
  en: {eyebrow:'BEYOND THE CASTLE',title:'Explore Monsaraz & Lake Alqueva',intro:'Continue your visit with 31 detailed guides to nearby monuments, prehistoric stones, lakeside experiences, local crafts and practical itineraries.',all:'View all 31 visitor guides',language:''},
  pt: {eyebrow:'PARA ALÉM DO CASTELO',title:'Explore Monsaraz e o Lago Alqueva',intro:'Descubra 31 guias de monumentos, vestígios megalíticos, paisagens, artesanato e roteiros práticos na região.',all:'Ver os 31 guias',language:'Os artigos estão disponíveis em inglês.'},
  zh: {eyebrow:'探索城堡周边',title:'蒙萨拉什与阿尔克瓦湖游览指南',intro:'继续探索周边古迹、史前巨石、湖区景观、传统工艺及行程建议，共 31 篇独立攻略。',all:'查看全部 31 篇攻略',language:'详细内容目前提供英文版本。'},
  mwl: {eyebrow:'ALÉM DEL CASTIELHO',title:'Descubra Monsaraz i l Lago Alqueva',intro:'31 guias de monumentos, sítios megalíticos, paisagens, artesanato i percursos na region.',all:'Ber ls 31 guias',language:'Ls artigos stan an anglés.'},
};

const featured = [
  {slug:'monsaraz-medieval-village',image:'/explore/monsaraz-medieval-village.jpg',en:'Medieval Village',pt:'Vila Medieval',zh:'蒙萨拉什中世纪村落',mwl:'Bila Medieval'},
  {slug:'cromeleque-do-xerez',image:'/explore/cromeleque-do-xerez.jpg',en:'Xerez Cromlech',pt:'Cromeleque do Xerez',zh:'Xerez 史前巨石群',mwl:'Cromeleque do Xerez'},
  {slug:'igreja-nossa-senhora-da-lagoa',image:'/explore/igreja-nossa-senhora-da-lagoa.jpg',en:'Nossa Senhora da Lagoa',pt:'Igreja da Lagoa',zh:'湖之圣母教堂',mwl:'Eigreija de la Lagoa'},
  {slug:'praia-fluvial-de-monsaraz',image:'/explore/praia-fluvial-de-monsaraz.jpg',en:'Monsaraz River Beach',pt:'Praia Fluvial',zh:'蒙萨拉什湖滩',mwl:'Praia Flubial'},
  {slug:'sao-pedro-do-corval-pottery',image:'/explore/sao-pedro-do-corval-pottery.jpg',en:'Corval Pottery',pt:'Olaria de São Pedro do Corval',zh:'科尔瓦尔传统陶艺',mwl:'Olaria de Corval'},
  {slug:'monsaraz-one-day-itinerary',image:'/gallery/monsaraz-castle-4.jpg',en:'One-Day Itinerary',pt:'Roteiro de Um Dia',zh:'蒙萨拉什一日游',mwl:'Percurso dun Die'},
];

export default function ExploreSection({locale}:{locale:string}) {
  const t=textByLocale[locale]||textByLocale.en;
  return <section id="explore" className="py-16 sm:py-24 px-4 sm:px-6" style={{background:'var(--bg-primary)'}}>
    <div className="max-w-6xl mx-auto">
      <p className="text-xs font-bold tracking-[0.2em] mb-3" style={{color:'var(--accent)'}}>{t.eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold" style={{color:'var(--text-primary)'}}>{t.title}</h2>
      <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-3xl" style={{color:'var(--text-secondary)'}}>{t.intro}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-9">
        {featured.map(item=><Link href={`/en/explore/${item.slug}`} key={item.slug} className="group block rounded-xl overflow-hidden transition-transform hover:-translate-y-1" style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)'}}>
          <div className="relative aspect-[4/3]"><Image src={item.image} alt={item.en} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover"/></div>
          <div className="p-4 flex items-center justify-between gap-2"><h3 className="font-semibold text-sm sm:text-base" style={{color:'var(--text-primary)'}}>{item[locale as keyof typeof item]||item.en}</h3><span aria-hidden="true" style={{color:'var(--accent)'}}>→</span></div>
        </Link>)}
      </div>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Link href="/en/explore" className="inline-flex items-center rounded-lg px-6 py-3 text-white font-semibold transition-opacity hover:opacity-90" style={{background:'var(--accent)'}}>{t.all} →</Link>
        {t.language&&<span className="text-xs" style={{color:'var(--text-muted)'}}>{t.language}</span>}
      </div>
    </div>
  </section>;
}
