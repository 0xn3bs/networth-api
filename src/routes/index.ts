import { Router } from 'express';
import AssetRouter from './Assets';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/assets', AssetRouter);

// Export the base-router
export default router;
