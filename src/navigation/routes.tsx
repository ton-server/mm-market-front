import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { MemePage } from '@/pages/MemePage/MemePage';
import { AssetPage } from '@/pages/AssetPage/AssetPage';

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
];
