import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = 'https://www.monsarazcastle.com';
const locales = ['pt', 'en', 'zh', 'mwl'];

const slugByLocale: Record<string, string> = {
  en: '/en/visit-monsaraz-castle',
  pt: '/pt/visitar-castelo-de-monsaraz',
  zh: '/zh/visit-monsaraz-castle',
  mwl: '/mwl/visitar-castelo-de-monsaraz',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Homepage (one canonical path per locale).
  for (const locale of locales) {
    const url = `${baseUrl}/${locale}`;
    const languages: Record<string, string> = {
      pt: `${baseUrl}/pt`,
      en: `${baseUrl}/en`,
      zh: `${baseUrl}/zh`,
      mwl: `${baseUrl}/mwl`,
      'x-default': `${baseUrl}/pt`,
    };
    sitemap.push({
      url,
      lastModified: new Date('2026-10-08'),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages },
    });
  }

  // Visit guide (localized slug per locale).
  for (const locale of locales) {
    const url = `${baseUrl}${slugByLocale[locale]}`;
    const languages: Record<string, string> = {
      pt: `${baseUrl}${slugByLocale.pt}`,
      en: `${baseUrl}${slugByLocale.en}`,
      zh: `${baseUrl}${slugByLocale.zh}`,
      mwl: `${baseUrl}${slugByLocale.mwl}`,
      'x-default': `${baseUrl}${slugByLocale.pt}`,
    };
    sitemap.push({
      url,
      lastModified: new Date('2026-10-08'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    });
  }

  return sitemap;
}
