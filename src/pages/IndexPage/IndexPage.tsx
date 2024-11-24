import { useEffect, useState, type FC } from 'react';
import { Card, Text, Button, Headline } from '@telegram-apps/telegram-ui';

import api from "@/api";
import { useWallet, shortAddress } from '@/hooks/useSwap';
import { Page } from '@/components/Page.tsx';
import { Link } from '@/components/Link/Link.tsx';

import './IndexPage.css';

export const IndexPage: FC = () => {
  const { connect, disconnect, account } = useWallet();

  const [memeList, setMemeList] = useState<any[]>([]);

  useEffect(() => {
    api.getMemeList().then(data => setMemeList(data));
  }, [])

  return (
    <Page back={false}>
      <div className='index-page_content'>
        <div className="index-page__dropdown">
          {account ?
            <>
              <Button size='s' className="index-page__dropdown-btn">{shortAddress(account.address, 4) + ' ▼'}</Button>
              <div className="index-page__dropdown-content">
                <Link to='/asset'>资产</Link>
                <Link to='#' onClick={disconnect}>退出</Link>
              </div>
            </> :
            <Button size='s' className="index-page__dropdown-btn" onClick={connect}>连接钱包</Button>
          }
        </div>
        <Headline className='index-page_title'>推荐列表</Headline>
        <div className='index-page__meme-list'>
          {memeList.map(meme =>
            <Card key={meme.address} className='index-page__card'>
              <img src={meme.image} />
              <Text> {meme.name} </Text>
              <Link to={`/meme?data=${JSON.stringify(meme)}`}>购买</Link>
            </Card>)}
        </div>
      </div>
    </Page>
  );
};
