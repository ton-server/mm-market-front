
import { request } from "./axios";

import "./mock";

export const getMemeList = () => {
    return request<any[]>("/meme_list");
}

export const getVIPReceiver = () => {
    return request<string>("/vip_receiver");
}

export const getIdentity = (address: string) => {
    return request<{ [key: string]: any }>("/identity", { address });
}

export const upgradeVIP = (address: string, boc: string) => {
    return request<boolean>("/upgrade", { address, boc }, "POST");
}