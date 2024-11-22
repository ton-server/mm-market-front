import { useEffect, useState, type FC } from 'react';
import { useTonWallet, useTonConnectModal } from '@tonconnect/ui-react';
import { Section, Text, Button } from '@telegram-apps/telegram-ui';

import { getMemeList } from "@/api";
import { Page } from '@/components/Page.tsx';
import { Link } from '@/components/Link/Link.tsx';

import './IndexPage.css';

export const IndexPage: FC = () => {
  const wallet = useTonWallet();
  const connectModal = useTonConnectModal();

  const [memeList, setMemeList] = useState<any[]>([]);

  // 如果没有连接钱包，自动在2妙后弹出连接窗口
  useEffect(() => {
    const t = setTimeout(() => {
      if (!wallet) {
        connectModal.open();
      }
    }, 2000);
    return () => clearTimeout(t)
  }, [wallet])

  useEffect(() => {
    getMemeList().then(data => setMemeList(data))
  }, [])

  return (
    <Page back={false}>
        <Section header='推荐列表' className='index-page__meme-list'>
          {memeList.map(meme => <Link
            key={meme.address}
            to={`/meme_buy?data=${JSON.stringify(meme)}`}
            className='index-page__meme'
            >
              <img src={meme.image} className='index-page__meme_image' />
              <Text>{meme.name} <Button>购买</Button></Text>
          </Link>)}
        </Section>
        <Section header="持有资产">

        </Section>
    </Page>
  );
};
