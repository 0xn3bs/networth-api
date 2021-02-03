import { ValuedAsset } from "./valuedasset";

class Erc20ValuedAsset extends ValuedAsset {
    tokenInfo: any;
    
    constructor(ticker: string, count: number, price: number, value: number, address: string, tokenInfo: any) {
        super(ticker, count, price, value, address);
        this.tokenInfo = tokenInfo;
    }
}

export { Erc20ValuedAsset };