import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { Address } from "./address";
import { AddressType } from "./addresstype";

const {TDAConnector, getAuthorizationUrl} = require('@apigrate/tdameritrade');

class TdAmeritradeAddress implements Address {
    addressType: AddressType;
    client: any;

    apiKey: string;
    redirectUrl: string;

    constructor(apiKey: string, redirectUrl: string) {
        this.addressType = AddressType.TdAmeritrade;
        this.apiKey = apiKey;
        this.redirectUrl = redirectUrl;
    }

    async getAssets(): Promise<TrackedAsset[]> {
        return new Array<TrackedAsset>();
    }


}

export { TdAmeritradeAddress }