import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { MemePage } from '@/pages/MemePage/MemePage';
import { AssetPage } from '@/pages/AssetPage/AssetPage';
import { DetailPage } from '@/pages/DetailPage/DetailPage';
import { HistoryPage } from '@/pages/HistoryPage/HistoryPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/meme', Component: MemePage, title: 'Meme Page' },
  { path: '/asset', Component: AssetPage, title: 'Asset Page' },
  { path: '/detail', Component: DetailPage, title: 'Detail Page' },
  { path: '/history', Component: HistoryPage, title: 'History Page' },
];
