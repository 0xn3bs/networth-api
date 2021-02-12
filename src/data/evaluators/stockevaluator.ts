import { StockValuedAsset } from "@data/assets/valuedassets/stockvaluedasset";
import { ValuedAsset } from "@data/assets/valuedassets/valuedasset";
import { Evaluator } from "./evaluator";

const yahoostockprices = require('yahoo-stock-prices');

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class StockEvaluator implements Evaluator {
    async hydrateValuedAssets(valuedAssets: ValuedAsset[]): Promise<void> {
        for(let i = 0; i < valuedAssets.length; ++i) {
            const valuedAsset = valuedAssets[i];

            if(valuedAsset.isEvaluated) {
                continue;
            }

            if(valuedAsset instanceof StockValuedAsset) {
                console.log(`StockEvaluator evaluating ${valuedAsset.ticker}`);

                const stockValuedAsset = valuedAsset as StockValuedAsset;

                const price = await yahoostockprices.getCurrentPrice(valuedAsset.ticker);

                stockValuedAsset.price = price;
                stockValuedAsset.value = stockValuedAsset.count * stockValuedAsset.price;
                valuedAsset.isEvaluated = true;
            }
        }
    }
}

export { StockEvaluator };
