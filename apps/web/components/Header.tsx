"use client";
import { useLocale } from './LocaleContext';

export default function Header() {
  const { t } = useLocale();
  return <h1 className="text-2xl font-bold flex-1">{t('headerTitle')}</h1>;
}