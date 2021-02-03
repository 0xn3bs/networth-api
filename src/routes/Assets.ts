import StatusCodes from 'http-status-codes';
import e, { Request, Response, Router } from 'express';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError, IRequest } from '@shared/constants';
import { Address } from '@data/addresses/address';
import { KrakenAddress } from '@data/addresses/krakenaddress';
import { EthAddress } from '@data/addresses/ethaddress';
import { Wallet } from '@data/wallet';
import { CoinbaseProAddress } from '@data/addresses/coinbaseproaddress';
import { EvaluatorPipeline } from '@data/evaluators/evaluatorpipeline';
import { Erc20Evaluator } from '@data/evaluators/erc20evaluator';
import { DefaultEvaluator } from '@data/evaluators/defaultevaluator';

const router = Router();
const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

const addresses: Array<Address> = [
    new CoinbaseProAddress (
 
    ),
    new KrakenAddress(
'
    ),
    new EthAddress(
'
      ),
    new EthAddress(
'
    )
  ];

const NodeCache = require("node-cache");
const cache = new NodeCache();

var cron = require('node-cron');

async function getAssets() {
  const evaluatorPipeline = new EvaluatorPipeline([
    new Erc20Evaluator(),
    new DefaultEvaluator()
  ]);

  const wallet = new Wallet(addresses);
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

cron.schedule('*/5 * * * *', async () => {
    try {
        const assets = await getAssets();
        cache.set("assets", assets, 300);
    } catch (error) {
        console.error(error);
    }
});
  
router.get('/', async (req: Request, res: Response) => {
    let cacheValue = cache.get("assets");

    if (cacheValue == undefined) {
        return res.status(500).json({"error": "No assets!"});
    }
    
    return res.status(OK).json(cacheValue);
});


router.get('/now', async (req: Request, res: Response) => {
  const assets = await getAssets();
  return res.status(OK).json(assets);
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
