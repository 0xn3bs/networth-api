import { ValuedAsset } from "./valuedasset";

class StockValuedAsset extends ValuedAsset {
    constructor(ticker: string, count: number, price: number, value: number, address: string) {
        super(ticker, count, price, value, address);
    }
}

export { StockValuedAsset };