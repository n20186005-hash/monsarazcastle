'use client';

import { useTranslations, useMessages, useLocale } from 'next-intl';

const brandByLocale: Record<string, string> = {
  pt: 'Castelo de Monsaraz',
  en: 'Monsaraz Castle',
  zh: '蒙萨拉什城堡',
  mwl: 'Castielho de Monsaraz',
};

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const messages = useMessages() as any;
  const officialLinks = (messages?.footer?.officialLinks || []) as Array<{
    name: string;
    url: string;
  }>;
  const brand = brandByLocale[locale] || 'Monsaraz Castle';
  const prefix = `/${locale}`;

  const supportText: Record<string, string> = {
    pt: 'Para suporte técnico do website, contacte:',
    en: 'For website technical support, contact:',
    zh: '如需本网站技术支援，请联系：',
    mwl: 'Para suporte técnico de l sítio, contacte:',
  };
  const support = supportText[locale] || supportText.en;

  return (
    <footer
      className="py-12 px-4 sm:px-6"
      style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {brand}
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('officialResourcesTitle')}
            </p>
            <div className="flex flex-col gap-2">
              {officialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm"
                  style={{ color: 'var(--accent)' }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm mt-4 sm:mt-0">
            <a href={`${prefix}/explore`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">{t('explore')}</a>
            <a href={`${prefix}/privacy-policy`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('privacy')}
            </a>
            <a href={`${prefix}/terms-of-service`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('terms')}
            </a>
            <a href={`${prefix}/cookie-settings`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('cookies')}
            </a>
          </div>
        </div>

        <div
          className="pt-6 text-center text-sm space-y-4"
          style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
        >
          <p>{t('rights')}</p>
          <p className="text-xs max-w-3xl mx-auto leading-relaxed">{t('disclaimer')}</p>
          <p className="text-xs max-w-3xl mx-auto leading-relaxed">{t('photoCredit')}</p>
          <p className="text-xs max-w-3xl mx-auto leading-relaxed">
            {support}{' '}
            <a href="mailto:laupetter72@gmail.com" aria-label="Technical support email" className="hover:underline" style={{ color: 'var(--accent)' }}>
              laupetter72@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
