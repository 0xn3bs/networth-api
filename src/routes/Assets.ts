import StatusCodes from 'http-status-codes';
import e, { Request, Response, Router } from 'express';

import { paramMissingError, IRequest } from '@shared/constants';

const router = Router();

import { AssetService } from '../services/assetsservice';
import { CacheService } from '../services/cacheservice';

/*
router.get('/auth', async (req: Request, res: Response) => {
  const tda = new TDAConnector(client_id, redirect_url);
  const authUrl = getAuthorizationUrl(client_id, redirect_url);
  res.redirect(authUrl);
  const a = 1;
});
  
router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code;
  const tda = new TDAConnector(client_id, redirect_url);
  const credentials = await tda.getAccessToken(code);
  console.log(credentials);
  const a = 1;
});
*/

router.get('/', async (req: Request, res: Response) => {
    let cacheValue = CacheService.get("assets");

    if (cacheValue == undefined) {
        return res.status(500).json({"error": "No assets!"});
    }
    
    return res.status(StatusCodes.OK).json(cacheValue);
});

router.get('/now', async (req: Request, res: Response) => {
  const assets = await AssetService.getAssets();
  return res.status(StatusCodes.OK).json(assets);
});

export default router;
