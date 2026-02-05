'use client';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useLocale } from '../../components/LocaleContext';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TriScannerPage() {
  const { data: initialData, error } = useSWR(`${apiUrl}/scanner/tri`, fetcher);
  const [opps, setOpps] = useState<any[]>(initialData || []);
  const { t } = useLocale();
  useEffect(() => {
    if (initialData) setOpps(initialData);
  }, [initialData]);
  useEffect(() => {
    const es = new EventSource(`${apiUrl}/scanner/events/tri`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOpps((prev) => [data, ...prev].slice(0, 100));
      } catch {}
    };
    return () => es.close();
  }, []);
  if (error) return <div>{t('errorLoading')}</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('triOpportunities')}</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('cycle')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('net')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('volume')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('timestamp')}</th>
          </tr>
        </thead>
        <tbody>
          {opps.map((opp, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-2 py-1">{opp.details.cycle.join(' → ')}</td>
              <td className="px-2 py-1">{opp.details.net.toFixed(2)}%</td>
              <td className="px-2 py-1">{opp.details.volume}</td>
              <td className="px-2 py-1 text-xs text-gray-500">{new Date(opp.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}