import { useEffect, useState } from 'react';
import { useTonConnectUI, CHAIN } from '@tonconnect/ui-react';
import { TonClient, Address, toNano } from '@ton/ton';
import { DEX, pTON } from '@ston-fi/sdk';
import { StonApiClient, AssetKind, AssetTag } from '@ston-fi/api';
import assert from 'assert';
import api from "@/api";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: '83bfe6338b6cbebdb4f8f14b4bccfc2b91cd6eff80db3e141db8b7dcf8e4e830',
});
const dex = client.open(new DEX.v1.Router());
const stonApi = new StonApiClient();

// ton链的原生货币地址
export const tonToken = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
// Vip充值接收账户和金额
export const vipReceiver = 'UQClW8Jh_VKtWs9QO73enyYzLAHhQ-YTZjny2Kk20XAMf1Vt';
export const vipAmount = '0.1';


export interface WalletProps { tokenA?: string, tokenB?: string, loadList?: boolean, loadAssets?: boolean, loadHistory?: boolean }

export const useWallet = ({ tokenA, tokenB, loadList, loadAssets, loadHistory }: WalletProps) => {
    const [tonConnect] = useTonConnectUI();

    type Account = { address: string, chain: CHAIN, rawAddress: string, balance: bigint, expireTime: number };

    const [account, setAccount] = useState<Account | null>(null);
    const [swapRate, setSwapRate] = useState('0');
    const [recomList, setRecomList] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [swapRecords, setSwapRecords] = useState<any[]>([]);

    // 如果没有连接钱包，自动在2妙后弹出连接窗口
    useEffect(() => {
        const t = setTimeout(() => {
            if (!tonConnect.account) {
                tonConnect.openModal();
            }
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const updateAccount = async () => {
            if (tonConnect.account) {
                const _address = Address.parseRaw(tonConnect.account.address);
                const address = _address.toString({ bounceable: false });
                const rawAddress = _address.toRawString();
                let balance = 0n;
                let expireTime = 0;
                try {
                    balance = await client.getBalance(_address);
                    expireTime = await api.getExpireTime(address);
                } catch {
                    expireTime = Date.now() + 60 * 1000;
                }
                setAccount({
                    ...tonConnect.account,
                    address,
                    rawAddress,
                    balance,
                    expireTime,
                });
                if (loadAssets) {
                    setAssets(await getAssets(address));
                }
                if (loadHistory) {
                    setSwapRecords(await api.getSwapRecord(address));
                }
            } else {
                setAccount(null);
            }
        }

        if (tonConnect.account) updateAccount();

        return tonConnect.onStatusChange(updateAccount);
    }, []);

    useEffect(() => {
        if (loadList) {
            api.getMemeList()
                .then(data => setRecomList(data));
        }
        if (tokenA && tokenB) {
            simulateSwap(tokenA, tokenB, toNano('1000').toString())
                .then(({ swapRate }) => setSwapRate(swapRate));
        }
    }, []);

    const getAssets = async (owner: string) => {
        const assets = await stonApi.queryAssets({
            condition: AssetTag.WalletHasBalance,
            walletAddress: owner,
        });
        return assets.filter(asset => asset.kind !== AssetKind.Ton).map(asset => ({
            balance: asset.balance,
            address: asset.contractAddress,
            name: asset.meta?.displayName,
            symbol: asset.meta?.symbol,
            decimals: asset.meta?.decimals,
            image: asset.meta?.imageUrl,
        }));
    };

    const simulateSwap = async (offerToken: string, askToken: string, amount: string) => {
        const result = await stonApi.simulateSwap({
            offerAddress: offerToken,
            askAddress: askToken,
            offerUnits: amount,
            slippageTolerance: "0.01",
            dexV2: true,
        });
        return {
            swapRate: result.swapRate,
            askAmount: result.askUnits,
            minAskAmount: result.minAskUnits,
        };
    };

    // 代币兑换，Ton币的地址为{tonToken}
    const swap = async (offerToken: string, askToken: string, amount: number, decimals: number) => {
        assert(account, "No wallet connected!");
        assert(account.chain == CHAIN.MAINNET, "Not mainnet!");
        assert(account.expireTime > Date.now(), "account expired!");


        let txParams;
        const offerAmount = BigInt(amount * 10 ** Number(decimals));
        if (offerToken === tonToken) {
            txParams = await dex.getSwapTonToJettonTxParams({
                userWalletAddress: account.address,
                proxyTon: new pTON.v1(),
                askJettonAddress: askToken,
                offerAmount: offerAmount,
                minAskAmount: 0,
            });
        } else if (askToken === tonToken) {
            txParams = await dex.getSwapJettonToTonTxParams({
                userWalletAddress: account.address,
                offerJettonAddress: offerToken,
                proxyTon: new pTON.v1(),
                offerAmount: offerAmount,
                minAskAmount: 0,
            });
        } else {
            txParams = await dex.getSwapJettonToJettonTxParams({
                userWalletAddress: account.address,
                offerJettonAddress: offerToken,
                askJettonAddress: askToken,
                offerAmount: offerAmount,
                minAskAmount: 0
            });
        }
        const { boc } = await tonConnect.sendTransaction(
            {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: txParams.to.toString(),
                        amount: txParams.value.toString(),
                        payload: txParams.body?.toBoc().toString("base64"),
                    },
                ],
            },
        );
        // 将兑换记录保存到服务器上面
        api.saveSwapRecord(account.address, offerToken === tonToken ? '' : offerToken, askToken, amount.toString(), boc);
        return boc;
    };

    const upgrade = async () => {
        assert(account, "No wallet connected!");
        assert(account.chain === CHAIN.MAINNET, "Not mainnet!");
        assert(account.expireTime < Date.now(), "account expired!");

        const { boc } = await tonConnect.sendTransaction(
            {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: vipReceiver,
                        amount: toNano(vipAmount).toString(),
                    },
                ],
            },
        );
        // 设置一年会员时间
        account.expireTime = Date.now() + 365 * 24 * 3600 * 1000;
        return boc;
    }

    return {
        connect: () => tonConnect.openModal(),
        disconnect: () => tonConnect.disconnect(),
        account,
        swapRate,
        recomList,
        assets,
        swapRecords,
        simulateSwap,
        swap,
        upgrade,
    };
};