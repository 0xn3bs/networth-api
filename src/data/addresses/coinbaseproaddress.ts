import { Address } from "./address";
import { AddressType } from "./addresstype";
import { TrackedAsset } from "../assets/trackedassets/trackedasset";
import {CoinbasePro} from 'coinbase-pro-node';

class CoinbaseProAddress implements Address {
    addressType: AddressType;
    apiKey: string;
    apiSecret: string;
    passphrase: string;
    client: any;
    assetPairs: any;

    constructor(apiKey: string, apiSecret: string, passPhrase: string) {
        this.addressType = AddressType.Kraken;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.passphrase = passPhrase;
        
        this.client = new CoinbasePro({apiKey: this.apiKey, apiSecret: this.apiSecret, passphrase: this.passphrase, useSandbox: false});
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
        
        await this.client.rest.account.listAccounts().then(accounts => {
            const message = `You can trade "${accounts.length}" different pairs.`;

            accounts.forEach(account => {
                if(Number(account.balance) != 0){
                    trackedAssets.push(new TrackedAsset(account.currency, account.balance, "Coinbase Pro"));
                }
            });
        });

        return trackedAssets;
    }
}

export { CoinbaseProAddress };