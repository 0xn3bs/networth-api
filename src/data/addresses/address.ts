import { AddressType } from "./addresstype";
import { TrackedAsset } from "../assets/trackedassets/trackedasset";

interface Address {
    addressType: AddressType;

    getAssets(): Promise<Array<TrackedAsset>>; 
}

export { Address };