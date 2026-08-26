import { Router } from 'express';
import { MLController } from '../controllers/ml.controller';

const router = Router();

router.get('/forecast/:symbol', MLController.getForecast);
router.get('/metrics', MLController.getMetrics);

export default router;
