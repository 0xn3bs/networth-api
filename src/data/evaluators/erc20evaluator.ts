import { Erc20ValuedAsset } from "@data/assets/valuedassets/erc20valuedasset";
import { ValuedAsset } from "@data/assets/valuedassets/valuedasset";
import { Evaluator } from "./evaluator";

const fetchretry = require('node-fetch-retry');

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class Erc20Evaluator implements Evaluator {
    async hydrateValuedAssets(valuedAssets: ValuedAsset[]): Promise<void> {
        for(let i = 0; i < valuedAssets.length; ++i) {
            const valuedAsset = valuedAssets[i];

            if(valuedAsset.isEvaluated) {
                continue;
            }

            if(valuedAsset instanceof Erc20ValuedAsset) {
                const erc20valuedAsset = valuedAsset as Erc20ValuedAsset;

                const price = await this.get1InchPriceToDai(erc20valuedAsset.tokenInfo);

                erc20valuedAsset.price = price;
                erc20valuedAsset.value = erc20valuedAsset.count * erc20valuedAsset.price;
                valuedAsset.isEvaluated = true;
            }
        }
    }

    async get1InchPriceToDai(tokenInfo: any) {
        try {
            const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

            const oneUnit = 1 * Math.pow(10, Number(tokenInfo.decimals));

            await delay(1000);

            const data = await fetchretry(`https://api.1inch.exchange/v2.0/quote?fromTokenAddress=${tokenInfo.address}&toTokenAddress=${daiContractAddress}&amount=${oneUnit}&complexityLevel=0`, {method: 'GET', retry: 3, pause: 1000});

            const json = await data.json();

            const dai = json.toTokenAmount / Math.pow(10, json.toToken.decimals);

            return dai;
        }
        catch(error) {
            return 0;
        }
    }
}

export { Erc20Evaluator }