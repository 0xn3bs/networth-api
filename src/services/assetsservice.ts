import { Wallet } from '@data/wallet';
import { EvaluatorPipeline } from '@data/evaluators/evaluatorpipeline';
import { Erc20Evaluator } from '@data/evaluators/erc20evaluator';
import { DefaultEvaluator } from '@data/evaluators/defaultevaluator';

import {getAddresses} from '../setup';

class AssetService {
    async getAssets() {
        const evaluatorPipeline = new EvaluatorPipeline([
          new Erc20Evaluator(),
          new DefaultEvaluator()
        ]);
      
        const wallet = new Wallet(getAddresses('wallet.json'));
        const assets = await wallet.getAssets();
      
        const responseAssets = await evaluatorPipeline.getAssets(assets);
      
        let total = 0;
      
        await responseAssets.forEach(responseAsset => {
            total += responseAsset.value;
        });
      
        responseAssets.sort((a, b) => (a.value > b.value) ? -1 : 1);
      
        const storedValue = {assets: responseAssets, total, updated: Date.now()};
      
        return storedValue;
      }
}

const _assetService = new AssetService();

export {_assetService as AssetService};
