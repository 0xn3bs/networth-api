import { Address } from "./addresses/address";
import { TrackedAsset } from "./assets/trackedassets/trackedasset";

class Wallet {
    addresses: Array<Address>;
    
    constructor(addresses: Array<Address>) {
        this.addresses = addresses;
    }

    async getAssets(): Promise<TrackedAsset[]> {
        let assets = new Array<TrackedAsset>();

        for(let i = 0; i < this.addresses.length; ++i) {
            const address = this.addresses[i];
            const addressAssets = await address.getAssets();
            assets = assets.concat(addressAssets);
        }

        return assets;
    }
}

export { Wallet };