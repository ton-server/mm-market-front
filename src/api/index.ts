
import { axios, request } from "./axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const getMemeList = async () => {
    const { data: { list } } = await request<{
        data: {
            list: {
                nickName: string,
                symbol: string,
                decimals: number,
                totalSupply: string,
                contractAddress: string,
                usd: string,
                change: string,
                coinInfo: {
                    detail: string,
                },
            }[]
        }
    }>("/coin/list?currentPage=1&pageSize=300&fullCoin=1");

    return list.map(item => {
        const extra = JSON.parse(item.coinInfo.detail);
        return {
            address: item.contractAddress,
            name: item.nickName,
            symbol: item.symbol,
            decimals: item.decimals,
            totalSupply: item.totalSupply,
            usdPrice: parseFloat(item.usd),
            dayChange: item.change,
            description: extra.description,
            image: extra.image,
            owner: extra.owner,
            recomIndex: extra['recommendation index'],
            recomReason: extra['recommended reason'],
        }
    });
}

// 获取兑换次数限制，会员无限制：返回-1
export const getExpireTime = async (address: string) => {
    const { data: { expireTime2 } } = await request<{ data: { expireTime2: number } }>("/user/queryOrCreate", { address });
    return expireTime2 * 1000;
}

export const saveSwapRecord = async (user: string, fromToken: string, toToken: string, costAmount: string, boc: string) => {
    // user填充到fromAddress表示买出Meme币，填充到toAddress表示卖如入Meme币
    if (fromToken !== '') {
        return await request<void>(
            "/history/create",
            { fromAddress: user, toAddress: '', contractAddress: fromToken, amount: costAmount, txInfo: boc },
            "POST",
        );
    } else {
        return await request<void>(
            "/history/create",
            { fromAddress: '', toAddress: user, contractAddress: toToken, amount: costAmount, txInfo: boc },
            "POST",
        );
    }

}

export const getSwapRecord = async (address: string) => {
    const { data } = await request<{
        data: {
            fromAddress: string,
            toAddress: string,
            contractAddress: string,
            amount: string,
            createTime2: number,
        }[]
    }>("/history/query", { address });

    return data.map(({ fromAddress, toAddress, contractAddress, amount, createTime2 }) => {
        if (fromAddress !== '') {
            return { user: fromAddress, fromToken: contractAddress, toToken: '', costAmount: amount, time: createTime2 * 1000 };
        } else {
            return { user: toAddress, fromToken: '', toToken: contractAddress, costAmount: amount, time: createTime2 * 1000 };
        }
    });
}

export default {
    getMemeList,
    getExpireTime,
    saveSwapRecord,
    getSwapRecord,
}
