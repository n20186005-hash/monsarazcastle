import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

const baseUrl = 'https://www.monsarazcastle.com';

const slugByLocale: Record<string, string> = {
  en: '/en/visit-monsaraz-castle',
  pt: '/pt/visitar-castelo-de-monsaraz',
  zh: '/zh/visit-monsaraz-castle',
  mwl: '/mwl/visitar-castelo-de-monsaraz',
};

const localeUrls: Record<string, string> = {
  en: `${baseUrl}${slugByLocale.en}`,
  pt: `${baseUrl}${slugByLocale.pt}`,
  zh: `${baseUrl}${slugByLocale.zh}`,
  mwl: `${baseUrl}${slugByLocale.mwl}`,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'visitGuide' });
  const selfUrl = localeUrls[locale] || localeUrls.pt;

  return {
    metadataBase: new URL(baseUrl),
    title: t('heroTitle'),
    description: t('heroSubtitle'),
    alternates: {
      canonical: selfUrl,
      languages: {
        pt: localeUrls.pt,
        en: localeUrls.en,
        zh: localeUrls.zh,
        mwl: localeUrls.mwl,
        'x-default': localeUrls.pt,
      } as Record<string, string>,
    },
    openGraph: {
      title: t('heroTitle'),
      description: t('heroSubtitle'),
      url: selfUrl,
      siteName: 'Monsaraz Castle',
      locale: locale === 'pt' || locale === 'mwl' ? 'pt_PT' : locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [
        { url: `${baseUrl}/gallery/monsaraz-castle-1.jpg`, width: 1600, height: 1200, alt: t('heroTitle') },
      ],
    },
  };
}

export default async function VisitGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('visitGuide');
  const tHeader = await getTranslations('header');
  const tHero = await getTranslations('hero');
  const messages = (await import(`@/messages/${locale}.json`)).default as any;
  const homeHref = `/${locale}`;

  const quickFacts: Array<{ label: string; value: string }> =
    messages?.visitGuide?.quickFacts || [];
  const sections: Array<{ id: string; title: string; content: string }> =
    messages?.visitGuide?.sections || [];
  const faq: Array<{ q: string; a: string }> = messages?.visitGuide?.faq || [];

  const selfUrl = localeUrls[locale] || localeUrls.pt;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: tHero('title'),
            item: `${baseUrl}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('heroTitle'),
            item: selfUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <a
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {tHeader('backToHome')}
        </a>

        <h1
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('heroTitle')}
        </h1>
        <p className="text-base sm:text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
          {t('heroSubtitle')}
        </p>
        <p className="text-xs mb-10" style={{ color: 'var(--text-muted)' }}>{t('updated')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <p
          className="text-lg leading-relaxed mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        {/* Quick facts */}
        <h2
          className="font-display text-2xl font-semibold mb-5"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('quickFactsTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {quickFacts.map((fact, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                {fact.label}
              </div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {fact.value}
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-12 mb-14">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2
                className="font-display text-2xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {section.title}
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <section>
          <h2
            className="font-display text-2xl font-semibold mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('faqTitle')}
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="rounded-xl p-5"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <summary className="font-medium cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                  {item.q}
                </summary>
                <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-14 rounded-xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)' }}>
          <h2
            className="font-display text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('relatedTitle')}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {t('relatedIntro')}
          </p>
          <a
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {tHeader('backToHome')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </section>
      </div>
    </div>
  );
}
