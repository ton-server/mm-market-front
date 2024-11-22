import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot, Section, Title } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { TonConnectButton } from '@tonconnect/ui-react';

import { routes } from '@/navigation/routes.tsx';

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Section >
        <Title style={{ height: "50px" }}>
          Meme Coin Trade
          <TonConnectButton style={{ float: "right" }} />
        </Title>
      </Section>
      <Section >
        <HashRouter>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </Section>
    </AppRoot>
  );
}
