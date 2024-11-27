
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
              { title: '名称', value: meme.name },
              { title: '符号', value: meme.symbol },
              { title: '精度', value: meme.decimals },
              { title: '地址', value: meme.address },
              { title: '发行量', value: meme.totalSupply },
              { title: '所有者', value: meme.owner },
              { title: '价格', value: price2Str(meme.usdPrice) },
              { title: '24H涨幅', value: meme.dayChange },
              { title: '推荐指数', value: meme.recomIndex },
              { title: '推荐原因', value: meme.recomReason },
              { title: '描述', value: meme.description },
            ]}
          />
        </List>
        <div style={{ height: "100px" }}></div>
        <div className='detail-page_button-div'>
          <Button
            size='l'
            onClick={() => navigate(`/meme?data=${JSON.stringify(meme)}`)}
          >
            购买
          </Button>
        </div>
      </div>
    </Page>
  );
};
