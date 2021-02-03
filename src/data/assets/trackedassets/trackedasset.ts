class TrackedAsset {
    ticker: string;
    count: number;
    address: string;

    constructor(ticker: string, count: number, address: string) {
        this.ticker = ticker;
        this.count = count;
        this.address = address;
    }
}

export { TrackedAsset };