'use client';

import useSWR from 'swr';

// Adjust import path to use LocaleContext from app/components directory
import { useLocale } from '../../components/LocaleContext';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OpportunityPage({ params }: { params: { id: string } }) {
  const { data: opp } = useSWR(`${apiUrl}/opportunities/${params.id}`, fetcher);
  const { t } = useLocale();
  if (!opp) return null;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('opportunities')}</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(opp, null, 2)}
      </pre>
    </div>
  );
}
