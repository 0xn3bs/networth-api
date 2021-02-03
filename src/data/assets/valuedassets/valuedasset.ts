class ValuedAsset {
    ticker: string;
    count: number;
    price: number;
    value: number;
    address: string;
    isEvaluated: boolean;

    constructor(ticker: string, count: number, price: number, value: number, address: string) {
        this.ticker = ticker;
        this.count = count;
        this.price = price;
        this.value = value;
        this.address = address;
        this.isEvaluated = false;
    }
}

export { ValuedAsset };