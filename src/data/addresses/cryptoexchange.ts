import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { Address } from "./address";
import { AddressType } from "./addresstype";


class CryptoExchange implements Address {
    addressType: AddressType;
    client: any;
    name: string;
    assetPairs: any;
        
    constructor(client: any, name: string) {
        this.addressType = AddressType.CryptoExchange;
        this.client = client;
        this.name = name;
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

        const balances = (await this.client.fetchBalance()).total;

        const keys = Object.keys(balances);
        
        for(let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            let value = balances[key];

            if (value > 0) {
                trackedAssets.push(new TrackedAsset(key, value, this.name));
            }
        }

        return trackedAssets;
    }
}

export { CryptoExchange };
