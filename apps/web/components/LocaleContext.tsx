"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ua' | 'ru';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const defaultLocale: Locale = 'en';

const messages: Record<Locale, Record<string, string>> = {
  en: {
    headerTitle: 'Exchanges Analytics',
    exchanges: 'Exchanges',
    scanners: 'Scanners',
    spotArb: 'Spot Arbitrage (CEX↔CEX)',
    triArb: 'Triangular Arbitrage',
    p2pArb: 'P2P Scanner',
    details: 'Details',
    back: '← Back',
    opportunities: 'Opportunities',
    gross: 'Gross%',
    net: 'Net%',
    buy: 'Buy',
    sell: 'Sell',
    margin: 'Margin%',
    fiat: 'Fiat',
    timestamp: 'Timestamp',
    cycle: 'Cycle',
    volume: 'Volume',
    p2pOpportunities: 'P2P Opportunities',
    spotOpportunities: 'Spot Arbitrage Opportunities',
    triOpportunities: 'Triangular Arbitrage Opportunities',
    errorLoading: 'Error loading data',
  },
  ua: {
    headerTitle: 'Аналітика бірж',
    exchanges: 'Біржі',
    scanners: 'Сканери',
    spotArb: 'Спот-арбітраж (CEX↔CEX)',
    triArb: 'Трикутний арбітраж',
    p2pArb: 'P2P сканер',
    details: 'Деталі',
    back: '← Назад',
    opportunities: 'Можливості',
    gross: 'Валовий %',
    net: 'Чистий %',
    buy: 'Купити',
    sell: 'Продати',
    margin: 'Маржа %',
    fiat: 'Фіат',
    timestamp: 'Час',
    cycle: 'Цикл',
    volume: 'Обсяг',
    p2pOpportunities: 'P2P можливості',
    spotOpportunities: 'Можливості спот-арбітражу',
    triOpportunities: 'Можливості трикутного арбітражу',
    errorLoading: 'Помилка завантаження',
  },
  ru: {
    headerTitle: 'Аналитика бирж',
    exchanges: 'Биржи',
    scanners: 'Сканеры',
    spotArb: 'Спот-арбитраж (CEX↔CEX)',
    triArb: 'Треугольный арбитраж',
    p2pArb: 'P2P сканер',
    details: 'Детали',
    back: '← Назад',
    opportunities: 'Возможности',
    gross: 'Валовой %',
    net: 'Чистый %',
    buy: 'Купить',
    sell: 'Продать',
    margin: 'Маржа %',
    fiat: 'Фиат',
    timestamp: 'Время',
    cycle: 'Цикл',
    volume: 'Объём',
    p2pOpportunities: 'P2P возможности',
    spotOpportunities: 'Возможности спот-арбитража',
    triOpportunities: 'Возможности треугольного арбитража',
    errorLoading: 'Ошибка загрузки данных',
  },
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
    if (stored === 'ua' || stored === 'ru' || stored === 'en') {
      setLocale(stored);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);
  const t = (key: string) => {
    return messages[locale][key] || key;
  };
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('Locale context not found');
  return ctx;
}