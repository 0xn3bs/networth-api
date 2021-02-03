import { TrackedAsset } from "@data/assets/trackedassets/trackedasset";
import { ValuedAsset } from "@data/assets/valuedassets/valuedasset";

interface Evaluator {
    hydrateValuedAssets(valuedAssets: ValuedAsset[]): Promise<void>
}

export { Evaluator }
