
import { useNavigate, useSearchParams } from 'react-router-dom';
import { List, Button } from '@telegram-apps/telegram-ui';

import { DisplayData } from '@/components/DisplayData/DisplayData';
import { Page } from '@/components/Page';
import { price2Str } from '@/helpers/utils'

import './DetailPage.css';


export const DetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meme = JSON.parse(searchParams.get("data") || "{}");

  return (
    <Page>
      <div className='detail-page_content'>
        <List>
          <DisplayData
            rows={[
              { title: 'Name', value: meme.name },
              { title: 'Symbol', value: meme.symbol },
              { title: 'Decimals', value: meme.decimals },
              { title: 'Address', value: meme.address },
              { title: 'Total Supply', value: meme.totalSupply },
              { title: 'Owner', value: meme.owner },
              { title: 'USD Price', value: price2Str(meme.usdPrice) },
              { title: '24H Change', value: meme.dayChange },
              { title: 'Recommended Index', value: meme.recomIndex },
              { title: 'Recommended Reason', value: meme.recomReason },
              { title: 'Description', value: meme.description },
            ]}
          />
        </List>
        <div style={{ height: "100px" }}></div>
        <div className='detail-page_button-div'>
          <Button
            size='l'
            onClick={() => navigate(`/meme?data=${JSON.stringify(meme)}`)}
          >
            Buy
          </Button>
        </div>
      </div>
    </Page>
  );
};
