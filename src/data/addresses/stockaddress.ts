import { StockTrackedAsset } from "@data/assets/trackedassets/stocktrackedasset";
import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { Address } from "./address";
import { AddressType } from "./addresstype";

const fetchretry = require('node-fetch-retry');

class StockAddress implements Address {
    addressType: AddressType;
    ticker: string;
    balance: number;

    constructor(ticker: string, balance: number) {
        this.addressType = AddressType.Stock;
        this.ticker = ticker;
        this.balance = balance;
    }

    async getAssets(): Promise<Array<TrackedAsset>> {
        return new Array<TrackedAsset>(new StockTrackedAsset(this.ticker, this.balance, "Stock"));
    }
}

export { StockAddress }