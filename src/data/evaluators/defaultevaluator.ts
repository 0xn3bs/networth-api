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

    async tickerToCoinId(ticker: string, coins: any): Promise<any> {
        for(let i = 0; i < coins.length; ++i) {
            if(coins[i].symbol.toLowerCase() === ticker.toLowerCase()) {
                return coins[i].id;
            }
        }

        return null;
    } 

    async coinIdToTicker(id: string, coins: any) {
        for(let i = 0; i < coins.length; ++i) {
            if(coins[i].id.toLowerCase() === id.toLowerCase()) {
                return coins[i].symbol;
            }
        }
    }

    async getPrices(tickers: Set<string>): Promise<any> {
        let tickersA = Array.from(tickers);
        let ids = Array<string>();

        let prices = {};

        const coins = (await CoinGeckoClient.coins.list()).data;

        for(let i = 0; i < tickersA.length; ++i) {
            const ticker = tickersA[i];
            const id = await this.tickerToCoinId(ticker, coins);

            if(id != null) {
                ids.push(id);
            }
        }

        const data = (await CoinGeckoClient.simple.price({
                        ids: ids,
                        vs_currencies: ['usd'],
                    })).data;

        var dataKeys = Object.keys(data);

        for(var i = 0; i < dataKeys.length; ++i) {
            const key = dataKeys[i];
            const ticker = (await this.coinIdToTicker(dataKeys[i], coins)).toUpperCase();
            const price = data[key]['usd'];
            prices[ticker] = price;
        }

        return prices;
    }
}

export { DefaultEvaluator }