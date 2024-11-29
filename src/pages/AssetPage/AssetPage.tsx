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
      <Headline className='asset-page_title'>Holding List</Headline>
      <div className='asset-page__asset-list'>
        {assets.map(asset =>
          <Card key={asset.address} className='asset-page__card'>
            <img src={asset.image} />
            <Text> Amount:{amount2Str(asset.balance, asset.decimals, 2)} </Text>
            <Link to={`/meme?token_in=${asset.address}&data=${JSON.stringify(asset)}`}>Sell</Link>
          </Card>)}
      </div>
    </Page>
  );
};
