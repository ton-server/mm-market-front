
import { useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Title, Button, Modal, Text, Link } from '@telegram-apps/telegram-ui';
import { toNano } from "@ton/ton";

import { useWallet, tonToken, vipReceiver, vipAmount, shortAddress, amount2Str } from '@/hooks/useSwap';
import { Page } from '@/components/Page.tsx';

import './MemePage.css';

// 购买或出售Meme界面
export const MemePage: FC = () => {
  const [searchParams] = useSearchParams();
  const meme = JSON.parse(searchParams.get("data") || "{}");
  const tokenA = searchParams.get("token_in") || tonToken;
  const tokenB = tokenA === tonToken ? meme.address : tonToken;

  const { connect, account, swapRate, swap, upgrade } = useWallet(tokenA, tokenB);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");


  const handleSwap = async () => {
    if (!account) {
      alert("先连接钱包才能交易！");
      connect();
      return;
    }

    if (account.expireTime < Date.now()) {
      setShowModal(true);
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value > Number(holdAmount)) {
      alert("输入金额有误！");
      return;
    }

    try {
      const offerAmount = tokenA === tonToken ?
        toNano(value) :
        BigInt(value * 10 ** Number(meme.decimals));
      await swap(tokenA, tokenB, offerAmount);
      alert("兑换成功！");
    } catch (error) {
      alert("兑换失败，请稍后重试！错误:" + error);
    }
  };

  const handleVIP = async () => {
    try {
      await upgrade();
      alert("账户升级成功！");
    } catch (error) {
      alert("账户升级失败，请稍后重试！错误:" + error);
    }
    setShowModal(false);
  };

  const handleInput = ({ target: { value } }: { target: { value: string } }) => {
    if (!account) {
      return;
    }
    if (value === "") {
      setAmount(value);
      return;
    }
    const amount = parseFloat(value);
    if (!isNaN(amount) && isFinite(amount) && amount >= 0) {
      setAmount(value);
    }
  }



  const copyVIPReceiver = () => {
    navigator.clipboard.writeText(vipReceiver);
  };

  const offerSymbol = tokenA === tonToken ? 'Ton' : meme.symbol;
  const askSymbol = tokenA !== tonToken ? 'Ton' : meme.symbol;
  const holdAmount = tokenA === tonToken ?
    amount2Str(account?.balance || 0n, 9) :
    amount2Str(meme.balance, meme.decimals);

  return (
    <Page>
      <div className='meme-page_content'>
        <Title>{meme.name}</Title>
        <img src={meme.image} className='meme-page_image' />
        <span>{`你将获得 ${Number((Number(swapRate) * Number(amount)).toFixed(3))} 个 ${askSymbol}`}</span>
        <input placeholder={`请输入支付${offerSymbol}数量`} value={amount} onChange={handleInput} className='meme-page_input' />
        <Text> 1 {offerSymbol} ≈ {Number(swapRate).toFixed(3)} {askSymbol} </Text>
        <Text style={{ float: "right" }}> {holdAmount} {offerSymbol} 可用 </Text>
        <Button onClick={handleSwap} className='meme-page_button'>提交交易</Button>
        <Text style={{ display: "block" }}>{`>> 充值`}</Text>
        {account &&
          <Link href='https://t.me/wallet/start' target='_blank'>地址：{shortAddress(account.address, 13)}</Link>}
      </div>
      <Modal style={{ backgroundColor: "goldenrod" }} open={showModal} onOpenChange={status => setShowModal(status)}>
        <div className='meme-page_upgrade'>
          <Text> 当前账户为普通用户，不能进行交易，如果需要继续交易，需要升级到VIP用户 </Text>
          <div style={{ width: "100%", height: "1px", backgroundColor: "black", margin: "16px auto" }} />
          <Text> 向<Link onClick={copyVIPReceiver}>{shortAddress(vipReceiver, 5)}</Link>充值 {vipAmount} ton,即成为VIP用户，享受无限次数的交易 </Text>
          <Button onClick={handleVIP} style={{ width: "100%", margin: "30px auto 20px" }}>账户升级</Button>
        </div>
      </Modal>
    </Page>
  );
};
