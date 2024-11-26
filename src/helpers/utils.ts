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