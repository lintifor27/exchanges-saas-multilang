"use client";
import { useLocale } from './LocaleContext';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'en' | 'ua' | 'ru';
    setLocale(val);
  };
  return (
    <select value={locale} onChange={handleChange} className="border rounded p-1 text-sm ml-auto">
      <option value="en">EN</option>
      <option value="ua">UA</option>
      <option value="ru">RU</option>
    </select>
  );
}