'use client';
import Link from 'next/link';
import useSWR from 'swr';
// Import useLocale from the app/components directory
import { useLocale } from './components/LocaleContext';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const { data: exchanges } = useSWR(`${apiUrl}/exchanges`, fetcher);
  const { t } = useLocale();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('exchanges')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exchanges && exchanges.map((ex: any) => (
          <div key={ex.id} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-bold">{ex.name}</h3>
            <p className="text-sm text-gray-500">{ex.ccxtId}</p>
            <div className="mt-2 flex space-x-2">
              <Link className="text-blue-600 underline" href={`/exchanges/${ex.slug}`}>{t('details')}</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">{t('scanners')}</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Link href="/scanners/cex" className="text-blue-600 underline">{t('spotArb')}</Link>
          </li>
          <li>
            <Link href="/scanners/tri" className="text-blue-600 underline">{t('triArb')}</Link>
          </li>
          <li>
            <Link href="/scanners/p2p" className="text-blue-600 underline">{t('p2pArb')}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}