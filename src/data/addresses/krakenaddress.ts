import { Address } from "./address";
import { AddressType } from "./addresstype";
import { TrackedAsset } from "../assets/trackedassets/trackedasset";

import { Client } from "kraken-api-node";

class KrakenAddress implements Address {
    addressType: AddressType;
    apiKey: string;
    apiSecret: string;
    kraken: any;
    assetPairs: any;

    constructor(apiKey: string, apiSecret: string) {
        this.addressType = AddressType.Kraken;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        
        this.kraken = new Client(this.apiKey, this.apiSecret);
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

    async getPriceForAssetPair(assetpair: any): Promise<number> {
        console.log(assetpair);
        console.log("ALTNAME: " + assetpair.altname);
        const res = (await this.kraken.ticker({pair: assetpair.altname})).result;
        const a = res[assetpair.base+assetpair.quote];
        return Number(a.l[0]);
    }

    async getAssets(): Promise<Array<TrackedAsset>> {
        const trackedAssets = new Array<TrackedAsset>();

        const balance = await this.kraken.balance();

        this.assetPairs = (await this.kraken.assetPairs()).result;
        
        const res = balance.result;

        const keys = Object.keys(res);

        for(let i = 0; i < keys.length; ++i){
            const key = keys[i];
            const r = Number(res[key]);

            if(r > 0) {
                trackedAssets.push(new TrackedAsset(this.transformAssetId(key), r, 'Kraken'));
            }
        }

        console.log(balance);

        return trackedAssets;
    }

    transformAssetId(assetId: string): string {
        const dict = {
            "XXBT": "BTC"
        };

        if(assetId in dict) {
            return dict[assetId];
        }

        return assetId;
    }
}

export { KrakenAddress };