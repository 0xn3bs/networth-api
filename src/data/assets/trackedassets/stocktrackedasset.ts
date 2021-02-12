import { TrackedAsset } from "./trackedasset";

class StockTrackedAsset extends TrackedAsset {
    constructor(ticker: string, count: number, address: string) {
        super(ticker, count, address);
    }
}

export { StockTrackedAsset }