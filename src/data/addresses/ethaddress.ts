import {Address} from "./address";
import {AddressType} from "./addresstype";
import { Erc20TrackedAsset } from "../assets/trackedassets/erc20trackedasset";
import {TrackedAsset} from "../assets/trackedassets/trackedasset";

const fetchretry = require('node-fetch-retry');

class EthAddress implements Address {
    addressType: AddressType;
    address: string;
    apiKey: string;

    constructor(address: string, apiKey: string) {
        this.addressType = AddressType.Ethereum;
        this.address = address;
        this.apiKey = apiKey;
    }

    async getData() {
        return await fetchretry(`https://api.ethplorer.io/getAddressInfo/${this.address}?apiKey=${this.apiKey}`, {method: 'GET', retry: 3, pause: 1000});
    }

    getAddressMasked () : string
    {
        return this.address.substring(0, 5) + "...." + this.address.slice(-5);
    }

    async getAssets() : Promise<Array<TrackedAsset>> {
        const data = await this.getData();
        const json = await data.json();
        
        const eth = new TrackedAsset("ETH", json.ETH.balance, this.getAddressMasked());

        const tokenAssets = await this.getTokenAssets(json.tokens);

        const assets = tokenAssets.concat([eth]);

        return assets;
    }

    async getTokenAssets(tokens: any) : Promise<Array<TrackedAsset>> {
        const res = new Array<TrackedAsset>();

        for(let i = 0; i < tokens.length; ++i){
            const token = tokens[i];
            const tokenInfo = token.tokenInfo;
            const ticker = tokenInfo.symbol;
            const decimals = Number(tokenInfo.decimals);
            const balance = token.balance / Math.pow(10, decimals);
            
            if(balance > 0) {
                res.push(new Erc20TrackedAsset(ticker, balance, this.getAddressMasked(), tokenInfo));
            }
        }

        return res;
    }
}

export { EthAddress };