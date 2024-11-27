import { Text, Button, Headline } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';

import { useWallet, } from '@/hooks/useSwap';
import { shortAddress, price2Str } from "@/helpers/utils";
import { Page } from '@/components/Page';

import './IndexPage.css';

export const IndexPage = () => {
  const navigate = useNavigate();
  const { connect, disconnect, account, recomList } = useWallet({ loadList: true });

  return (
    <Page back={false}>
      <div className='index-page_content'>
        <div className="index-page__dropdown">
          {account ?
            <>
              <Button size='s' className="index-page__dropdown-btn">{shortAddress(account.address, 4) + ' ▼'}</Button>
              <div className="index-page__dropdown-content">
                <a onClick={() => navigate('/asset')}>资产</a>
                <a onClick={() => navigate('/history')}>历史</a>
                <a onClick={disconnect}>退出</a>
              </div>
            </> :
            <Button size='s' className="index-page__dropdown-btn" onClick={connect}>连接钱包</Button>
          }
        </div>
        <Headline className='index-page_title'>推荐列表</Headline>
        <div className='index-page__meme-list'>
          {recomList.map(meme =>
            <div onClick={() => navigate(`/detail?data=${JSON.stringify(meme)}`)} key={meme.address} className='index-page__card'>
              <img src={meme.image} />
              <Text className='index-page__card-name'>{meme.name}</Text>
              <Text className='index-page__card-price'>{price2Str(meme.usdPrice)}</Text>
              {meme.dayChange === '--' && <label className='index-page__card-change'>--</label>}
              {meme.dayChange !== '--' && <label className='index-page__card-change' style={{ color: parseFloat(meme.dayChange) < 0 ? 'red' : 'green' }}>{meme.dayChange}</label>}
            </div>)}
        </div>
      </div>
    </Page>
  );
};
