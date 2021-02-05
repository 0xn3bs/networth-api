import { Address } from "./address";
import { AddressType } from "./addresstype";
import { TrackedAsset } from "../assets/trackedassets/trackedasset";

const ccxt = require ('ccxt');

class CoinbaseAddress implements Address {
    addressType: AddressType;
    apiKey: string;
    apiSecret: string;
    client: any;
    assetPairs: any;

    constructor(apiKey: string, apiSecret: string) {
        this.addressType = AddressType.Kraken;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        
        this.client = new ccxt.coinbase(
            {
                apiKey: this.apiKey,
                secret: this.apiSecret
            }
        );
    }

    findAssetPair(assetpairs: any, base: string, quote: string): any {
        const keys = Object.keys(assetpairs);

        for(let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const assetpair = assetpairs[key];

            if(assetpair.base == base && assetpair.quote == quote && !assetpair.altname.includes(".")) {
                return assetpair;
            }
        }

        return null;
    }

    async getAssets(): Promise<Array<TrackedAsset>> {
        const trackedAssets = new Array<TrackedAsset>();

        const coinbaseBalances = (await this.client.fetchBalance()).total;

        const keys = Object.keys(coinbaseBalances);
        
        for(let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            let value = coinbaseBalances[key];

            if (value > 0) {
                trackedAssets.push(new TrackedAsset(key, value, "Coinbase"));
            }
        }

        return trackedAssets;
    }
}

export { CoinbaseAddress };
