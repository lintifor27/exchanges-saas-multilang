'use client';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
// Adjust import path to locate LocaleContext from the root components directory
import { useLocale } from '../../../components/LocaleContext';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExchangePage({ params }: { params: { slug: string } }) {
  const { t } = useLocale();
  const { data: exchange } = useSWR(`${apiUrl}/exchanges/${params.slug}`, fetcher);
  if (!exchange) return null;
  return (
    <div>
      <h2 className="text-2xl font-bold">{exchange.name}</h2>
      <p className="text-sm text-gray-500">{exchange.ccxtId}</p>
      <p className="mt-2">Maker fee: {exchange.makerFee}</p>
      <p>Taker fee: {exchange.takerFee}</p>
      <p>P2P supported: {exchange.p2pSupported ? 'Yes' : 'No'}</p>
      <div className="mt-4">
        <Link href="/" className="text-blue-600 underline">{t('back')}</Link>
      </div>
    </div>
  );
}