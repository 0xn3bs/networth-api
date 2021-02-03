import { ValuedAsset } from "./valuedassets/valuedasset";

class ResponseAsset {
    ticker: string;
    count: number;
    price: number;
    value: number;
    address: string;

    constructor(ticker: string, count: number, price: number, value: number, address: string){
        this.ticker = ticker;
        this.count = count;
        this.price = price;
        this.value = value;
        this.address = address;
    }

    static fromValuedAsset(valuedAsset: ValuedAsset) : ResponseAsset {
        return new ResponseAsset(valuedAsset.ticker, valuedAsset.count, valuedAsset.price, valuedAsset.value, valuedAsset.address);
    }
}

export { ResponseAsset }