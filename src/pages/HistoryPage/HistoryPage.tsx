
import { Card, List } from '@telegram-apps/telegram-ui';

import { useWallet } from '@/hooks/useSwap';
import { Page } from '@/components/Page';

import './HistoryPage.css';

export const HistoryPage = () => {
  const { swapRecords } = useWallet({ loadHistory: true });

  return (
    <Page>
      <div className='detail-page_content'>
        <List>
          {swapRecords.map(record =>
            <Card className='detail-page_card' key={record.time}>
              <div className='detail-page_card-type'>{record.fromToken !== '' ? '卖出' : '买入'}</div>
              <Card.Cell>时间： {new Date(record.time).toLocaleString()}</Card.Cell>
              <Card.Cell>支付： {record.costAmount}</Card.Cell>
              <Card.Cell>代币： {record.fromToken || record.toToken}</Card.Cell>
            </Card>
          )}
        </List>
      </div>
    </Page>
  );
};
