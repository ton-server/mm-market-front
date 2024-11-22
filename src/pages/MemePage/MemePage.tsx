
import { useEffect, useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { Navigate } from 'react-router-dom'
import { Title, Input, Button, Modal, Text, Link, Section } from '@telegram-apps/telegram-ui';
import { Address, TonClient, toNano, fromNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import { StonApiClient } from '@ston-fi/api';


import { getVIPReceiver, getIdentity, upgradeVIP } from "@/api";
import { Page } from '@/components/Page.tsx';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "83bfe6338b6cbebdb4f8f14b4bccfc2b91cd6eff80db3e141db8b7dcf8e4e830",
});

const dex = client.open(new DEX.v1.Router());

const stonApi = new StonApiClient();

// 购买或出售Meme界面
export const MemeBuy: FC = () => {
  const [searchParams] = useSearchParams();
  const meme = JSON.parse(searchParams.get("data") || "{}");

  if (!meme.address) {
    return <Navigate to='/' />;
  }

  const [tonConnect] = useTonConnectUI();
  const wallet = useTonAddress();
  const [vipReceiver, setVIPReceiver] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allowSwap, setAllowSwap] = useState(false);
  const [inTon, setInTon] = useState("");
  const [swapRate, setSwapRate] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (wallet) {
      client.getBalance(Address.parse(wallet))
        .then(value => setBalance(Number(fromNano(value))));
    }

    stonApi.simulateSwap({
      offerAddress: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
      askAddress: meme.address,
      offerUnits: toNano(1).toString(),
      slippageTolerance: "0.01",
      dexV2: true,
    }).then(({ swapRate }) => {
      setSwapRate(Number(swapRate));
    })
  }, [wallet])

  const handleBuy = async () => {
    if (!tonConnect.account?.address) {
      alert("先连接钱包才能购买！");
      tonConnect.openModal();
      return;
    }

    const identity = await getIdentity(wallet);

    if (identity.upgrading) {
      alert("账户正在升级中，请稍后再试！");
      return;
    }

    if (!identity.is_vip) {
      alert("成为VIP用户才能购买！");
      const receiver = await getVIPReceiver();
      setVIPReceiver(receiver);
      setShowModal(true);
      return;
    }

    try {
      const txParams = await dex.getSwapTonToJettonTxParams({
        offerAmount: toNano(inTon), // swap 1 TON
        askJettonAddress: meme.address, // for a STON
        minAskAmount: toNano("0"), // but not less than 0 STON
        proxyTon: new pTON.v1(),
        userWalletAddress: wallet,
      });
      const { boc } = await tonConnect.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: txParams.to.toString(),
            amount: txParams.value.toString(),
            payload: txParams.body?.toBoc().toString("base64"),
          },
        ]
      });
      console.log(boc);
      alert("兑换成功！");
    } catch (error) {
      alert("兑换失败，请稍后重试！错误:" + error);
    }
  };

  const handleVIP = async () => {
    try {
      const { boc } = await tonConnect.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
          address: vipReceiver,
          amount: "100000000"
        }]
      });
      await upgradeVIP(wallet, boc)
      alert("账户升级成功！");
      setShowModal(false);
    } catch (error) {
      alert("账户升级失败，请稍后重试！错误:" + error);
    }
  };

  const handleSetInTon = ({ target: { value } }: { target: { value: string } }) => {
    if (value === "") {
      setInTon(value);
      return;
    }
    const amount = parseFloat(value);
    if (!isNaN(amount) && isFinite(amount) && amount >= 0) {
      setInTon(value);
      setAllowSwap(amount <= balance);
    }
  }

  const shortAddress = (address: string, n: number) => {
    return address.slice(0, n) + '..' + address.slice(48 - n, 48);
  };

  const copyVIPReceiver = () => {
    navigator.clipboard.writeText(vipReceiver);
  };

  return (
    <Page>
      <Title>{meme.name}</Title>
      <img src={meme.image} />
      <span>{`你将获得 ${inTon === "" ? 0 : swapRate * Number(inTon)} 个 ${meme.symbol}`}</span>
      <Input placeholder='请输入支付Ton数量' value={inTon} onChange={handleSetInTon} />
      <Text> 1 Ton ≈ {swapRate} {meme.symbol} </Text>
      <Text style={{ float: "right" }}> {balance.toFixed(3)} Ton 可用 </Text>
      <Button disabled={!allowSwap} onClick={handleBuy} style={{ display: "block" }}>提交交易</Button>
      <Section>{`>> 充值`}</Section>
      <Link href='https://t.me/wallet/start' target='_blank'>{shortAddress(wallet, 18)}</Link>
      <Modal open={showModal} onOpenChange={status => setShowModal(status)} style={{ height: "60vw" }}>
        <Text> 当前账户为普通用户，不能进行交易，如果需要继续交易，需要升级到VIP用户 </Text>
        <Text> 向<a onClick={copyVIPReceiver}>{shortAddress(vipReceiver, 5)}</a>充值10ton,即成为VIP用户，享受无限次数的交易 </Text>
        <Button onClick={handleVIP}>账户升级</Button>
      </Modal>
    </Page>
  );
};
