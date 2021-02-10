import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { Address } from "./address";
import { AddressType } from "./addresstype";

const fetchretry = require('node-fetch-retry');

class BtcAddress implements Address {
    address: string;
    addressType: AddressType;

    constructor(address: string) {
        this.address = address;
        this.addressType = AddressType.Bitcoin;
    }

    async getAssets(): Promise<Array<TrackedAsset>> {
        const data = await this.getData();
        const json = await data.json();

        const balance = json.balance / 100000000;

        return new Array<TrackedAsset>(new TrackedAsset("BTC", balance, this.address));
    }

    async getData() {
        return await fetchretry(`https://api.blockcypher.com/v1/btc/main/addrs/${this.address}/balance`, {method: 'GET', retry: 3, pause: 1000});
    }
}

export { BtcAddress }