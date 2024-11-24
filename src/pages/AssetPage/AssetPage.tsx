import { useEffect, useState, type FC } from 'react';
import { Text, Headline, Card } from '@telegram-apps/telegram-ui';

import { useWallet, amount2Str } from '@/hooks/useSwap';
import { Page } from '@/components/Page.tsx';
import { Link } from '@/components/Link/Link.tsx';

import './AssetPage.css';

export const AssetPage: FC = () => {
  const { account, getAssets } = useWallet();

  const [assetList, setAssetList] = useState<any[]>([]);

  useEffect(() => {
    if (account) {
      getAssets().then(data => setAssetList(data));
    }
  }, [account])

  return (
    <Page back={false}>
      <Headline className='asset-page_title'>持有列表</Headline>
      <div className='asset-page__asset-list'>
        {assetList.map(asset =>
          <Card key={asset.address} className='asset-page__card'>
            <img src={asset.image} />
            <Text> 数量：{amount2Str(asset.balance, asset.decimals)} </Text>
            <Link to={`/meme?token_in=${asset.address}&data=${JSON.stringify(asset)}`}>出售</Link>
          </Card>)}
      </div>
    </Page>
  );
};
