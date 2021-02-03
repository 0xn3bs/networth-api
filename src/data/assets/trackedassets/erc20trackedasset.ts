import { TrackedAsset } from "./trackedasset";

class Erc20TrackedAsset extends TrackedAsset {
    tokenInfo: any;

    constructor(ticker: string, count: number, address: string, tokenInfo: any) {
        super(ticker, count, address);
        this.tokenInfo = tokenInfo;
    }
}

export { Erc20TrackedAsset }