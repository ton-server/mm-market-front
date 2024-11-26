import { Text, Headline, Card } from '@telegram-apps/telegram-ui';

import { useWallet, } from '@/hooks/useSwap';
import { amount2Str } from "@/helpers/utils";
import { Page } from '@/components/Page';
import { Link } from '@/components/Link/Link';

import './AssetPage.css';

export const AssetPage = () => {
  const { assets } = useWallet({ loadAssets: true });

  return (
    <Page>
      <Headline className='asset-page_title'>持有列表</Headline>
      <div className='asset-page__asset-list'>
        {assets.map(asset =>
          <Card key={asset.address} className='asset-page__card'>
            <img src={asset.image} />
            <Text> 数量：{amount2Str(asset.balance, asset.decimals)} </Text>
            <Link to={`/meme?token_in=${asset.address}&data=${JSON.stringify(asset)}`}>出售</Link>
          </Card>)}
      </div>
    </Page>
  );
};
