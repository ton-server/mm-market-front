
import { useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Title, Button, Modal, Text, Link } from '@telegram-apps/telegram-ui';

import { useWallet, tonToken, vipReceiver, vipAmount } from '@/hooks/useSwap';
import { shortAddress, amount2Str } from "@/helpers/utils";
import { Page } from '@/components/Page';

import './MemePage.css';

// 购买或出售Meme界面
export const MemePage: FC = () => {
  const [searchParams] = useSearchParams();
  const meme = JSON.parse(searchParams.get("data") || "{}");
  const tokenA = searchParams.get("token_in") || tonToken;
  const tokenB = tokenA === tonToken ? meme.address : tonToken;

  const { connect, account, swapRate, swap, upgrade } = useWallet({ tokenA, tokenB });
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");


  const handleSwap = async () => {
    if (!account) {
      alert("Connect your wallet before trading！");
      connect();
      return;
    }

    if (account.expireTime < Date.now()) {
      setShowModal(true);
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value > Number(holdAmount)) {
      alert("The amount entered is incorrect！");
      return;
    }

    try {
      const decimals = tokenA === tonToken ? 9 : meme.decimals;
      await swap(tokenA, tokenB, value, decimals);
      alert("Swap successful！");
    } catch (error) {
      alert("Swap Failed, Please try again later! error:" + error);
    }
  };

  const handleVIP = async () => {
    try {
      await upgrade();
      alert("Upgrade successful！");
    } catch (error) {
      alert("Upgrade Failed, Please try again later! error:" + error);
    }
    setShowModal(false);
  };

  const handleInput = ({ target: { value } }: { target: { value: string } }) => {
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
        <Text>
          {`You will get ${Number((Number(swapRate) * Number(amount)).toFixed(3))} ${askSymbol}`}
        </Text>
        <input placeholder={`Please enter the amount of ${offerSymbol} to be paid`} value={amount} onChange={handleInput} className='meme-page_input' />
        <Text> 1 {offerSymbol} ≈ {Number(swapRate).toFixed(3)} {askSymbol} </Text>
        <Text style={{ float: "right" }}> {holdAmount} {offerSymbol} Available </Text>
        <Button onClick={handleSwap} className='meme-page_button'>Submit Transaction</Button>
        <Text style={{ display: "block" }}>{`>> Top Up`}</Text>
        {account &&
          <Link href='https://t.me/wallet/start' target='_blank'>Address：{shortAddress(account.address, 13)}</Link>}
      </div>
      <Modal style={{ backgroundColor: "goldenrod" }} open={showModal} onOpenChange={status => setShowModal(status)}>
        <div className='meme-page_upgrade'>
          <Text> The current account is a common user and cannot trade. If you need to continue trading, you need to upgrade to a VIP user. </Text>
          <div style={{ width: "100%", height: "1px", backgroundColor: "black", margin: "16px auto" }} />
          <Text> Recharge {vipAmount} ton to <Link onClick={copyVIPReceiver}>{shortAddress(vipReceiver, 5)}</Link> to become a VIP user and enjoy unlimited transactions </Text>
          <Button onClick={handleVIP} style={{ width: "100%", margin: "30px auto 20px" }}>Account Upgrade</Button>
        </div>
      </Modal>
    </Page>
  );
};
