import { Erc20TrackedAsset } from "@data/assets/trackedassets/erc20trackedasset";
import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { ValuedAsset } from "@data/assets/valuedassets/valuedasset";
import { Erc20ValuedAsset } from "@data/assets/valuedassets/erc20valuedasset";
import { Evaluator } from "./evaluator";
import { ResponseAsset } from "@data/assets/responseasset";

class EvaluatorPipeline {
    evaluators: Evaluator[]

    constructor(evaluators: Evaluator[]) {
        this.evaluators = evaluators;
    }

    async getAssets(trackedAssets: TrackedAsset[]): Promise<ResponseAsset[]> {
        let responseAssets = Array<ResponseAsset>();

        let valuedAssets = await this.valueAssets(trackedAssets);
        
        for(let i = 0; i < valuedAssets.length; ++i) {
            const valuedAsset = valuedAssets[i];
            
            const responseAsset = ResponseAsset.fromValuedAsset(valuedAsset);

            if(responseAsset != null) {
                responseAssets.push(responseAsset);
            }
        }

        return responseAssets;        
    }

    async valueAssets(trackedAssets: TrackedAsset[]): Promise<ValuedAsset[]> {
        let valuedAssets = this.mapTrackedToValued(trackedAssets);

        for(let i = 0; i < this.evaluators.length; ++i) {
            const evaluator = this.evaluators[i];
            await evaluator.hydrateValuedAssets(valuedAssets);
        }

        return valuedAssets;
    }

    mapTrackedToValued(trackedAssets: TrackedAsset[]): ValuedAsset[] {
        const valuedAssets = Array<ValuedAsset>();

        trackedAssets.forEach(trackedAsset => {
            if(trackedAsset instanceof Erc20TrackedAsset){
                const valuedAsset = new Erc20ValuedAsset(trackedAsset.ticker, 
                    trackedAsset.count, 0, 0, trackedAsset.address, trackedAsset.tokenInfo);
                valuedAssets.push(valuedAsset);
            } else {
                const valuedAsset = new ValuedAsset(trackedAsset.ticker, 
                    trackedAsset.count, 0, 0, trackedAsset.address);
                valuedAssets.push(valuedAsset);
            }
        });

        return valuedAssets;
    }
}

export { EvaluatorPipeline }