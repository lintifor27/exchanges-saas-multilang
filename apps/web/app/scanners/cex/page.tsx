'use client';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useLocale } from '../../components/LocaleContext';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CexScannerPage() {
  const { data: initialData, error } = useSWR(`${apiUrl}/scanner/cex`, fetcher);
  const [opportunities, setOpportunities] = useState<any[]>(initialData || []);

  const { t } = useLocale();

  useEffect(() => {
    if (initialData) setOpportunities(initialData);
  }, [initialData]);

  useEffect(() => {
    const eventSource = new EventSource(`${apiUrl}/scanner/events/cex`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOpportunities((prev) => [data, ...prev].slice(0, 100));
      } catch (err) {
        console.error(err);
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  if (error) return <div>{t('errorLoading')}</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('spotOpportunities')}</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('buy')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('sell')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('gross')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('net')}</th>
            <th className="px-2 py-1 text-left text-xs font-medium">{t('timestamp')}</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-2 py-1">{opp.details.buyExchange}</td>
              <td className="px-2 py-1">{opp.details.sellExchange}</td>
              <td className="px-2 py-1">{opp.details.gross.toFixed(2)}%</td>
              <td className="px-2 py-1">{opp.details.net.toFixed(2)}%</td>
              <td className="px-2 py-1 text-xs text-gray-500">{new Date(opp.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}