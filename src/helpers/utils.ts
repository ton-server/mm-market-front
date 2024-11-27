export const shortAddress = (address: string, n: number) => {
    return address.slice(0, n) + '..' + address.slice(48 - n, 48);
};

export const amount2Str = (amount: bigint | string, decimals: number) => {
    let str = amount.toString();

    const saveDecimals = 3;
    if (str.length <= decimals - saveDecimals) {
        return '0';
    }
    while (str.length <= decimals) {
        str = '0' + str
    }
    str = str.slice(0, str.length - decimals) + '.' + str.slice(str.length - decimals, str.length - decimals + saveDecimals);

    return Number(str).toString();
}

export const price2Str = (price: number, decimals?: number) => {
    switch (decimals) {
        case 1:
            return price > 0.1 ? '$' + Number(price.toFixed(1)) : '<$0.1';
        case 2:
            return price > 0.01 ? '$' + Number(price.toFixed(2)) : '<$0.01';
        case 3:
            return price > 0.001 ? '$' + Number(price.toFixed(3)) : '<$0.001';
        default:
            return price > 0.0001 ? '$' + Number(price.toFixed(4)) : '<$0.0001';
    }
}