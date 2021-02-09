import { Erc20ValuedAsset } from "@data/assets/valuedassets/erc20valuedasset";
import { ValuedAsset } from "@data/assets/valuedassets/valuedasset";
import { Evaluator } from "./evaluator";

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

class DefaultEvaluator implements Evaluator {
	async hydrateValuedAssets(valuedAssets: ValuedAsset[]): Promise<void> {
        let tickers = new Set<string>();

        for(let i = 0; i < valuedAssets.length; ++i) {
            const valuedAsset = valuedAssets[i];

            if(valuedAsset.isEvaluated) {
                continue;
            }

            if(valuedAsset instanceof ValuedAsset && !(valuedAsset instanceof Erc20ValuedAsset)) {
                tickers.add(valuedAsset.ticker);
            }
        }

        let tickerPrices = await this.getPrices(tickers);

        for(let i = 0; i < valuedAssets.length; ++i) {
            const valuedAsset = valuedAssets[i];

            if(valuedAsset.isEvaluated) {
                continue;
            }

            if(valuedAsset instanceof ValuedAsset && !(valuedAsset instanceof Erc20ValuedAsset)) {
                if(valuedAsset.ticker in tickerPrices) {
                    valuedAsset.price = tickerPrices[valuedAsset.ticker];
                    valuedAsset.value = valuedAsset.price * valuedAsset.count;
                    valuedAsset.isEvaluated = true;
                }
            }
        }
    }

    //  TODO: Refactor so we make less calls to Coingecko
    //        In theory, we should be able to include all the coins in one call
    //        and do the de-dup logic last.
    async tickerToCoin(ticker: string, coins: any): Promise<any> {
        const potentials = new Array<any>();

        for(let i = 0; i < coins.length; ++i) {
            if(coins[i].symbol.toLowerCase() === ticker.toLowerCase()) {
                potentials.push(coins[i].id);
            }
        }

        const data = (await CoinGeckoClient.simple.price({
                        ids: potentials,
                        vs_currencies: ['usd'],
                        include_last_updated_at: true,
                        include_market_cap: true
                    })).data;

        const keys = Object.keys(data);

        if(keys.length > 0){
            //  If we get multiple hits, figure out which one has the largest market cap
            //  that's probably the "right" one.

            let largest_id = keys[0];
            let largest = data[keys[0]];

            for(let i = 0; i < keys.length; ++i) {
                const c = data[keys[i]];

                if(c.usd_market_cap > largest.usd_market_cap) {
                    largest_id = keys[i];
                    largest = c;
                }
            }

            let r = {};
            r[largest_id] = largest;
            return r
        }

        return null;
    } 

    async coinToTicker(id: string, coins: any) {
        for(let i = 0; i < coins.length; ++i) {
            if(coins[i].id.toLowerCase() === id.toLowerCase()) {
                return coins[i].symbol;
            }
        }
    }

    async getPrices(tickers: Set<string>): Promise<any> {
        let tickersA = Array.from(tickers);
        let ids = {};

        let prices = {};

        const coins = (await CoinGeckoClient.coins.list()).data;

        for(let i = 0; i < tickersA.length; ++i) {
            const ticker = tickersA[i];
            const coin = await this.tickerToCoin(ticker, coins);

            if(coin != null) {
                const seconds = Math.floor(Date.now() / 1000);

                var id = (Object.keys(coin))[0];

                //  If it's over an hour old, consider it stale, don't include it
                //  hopefully we'll get better pricing via 1inch.
                var last_updated_at = coin[id].last_updated_at;
                if(last_updated_at != null) {
                    if((seconds - coin[id].last_updated_at) < 3600) {
                        ids = {...ids, ...coin};
                    }
                }
            }
        }

        var dataKeys = Object.keys(ids);

        for(var i = 0; i < dataKeys.length; ++i) {
            const key = dataKeys[i];
            const ticker = (await this.coinToTicker(dataKeys[i], coins)).toUpperCase();
            const price = ids[key]['usd'];
            prices[ticker] = price;
        }

        return prices;
    }
}

export { DefaultEvaluator }