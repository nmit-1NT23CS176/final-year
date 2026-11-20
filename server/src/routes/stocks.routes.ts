import { Router } from 'express';
import { StocksController } from '../controllers/stocks.controller';

const router = Router();

router.get('/search', StocksController.search);
router.get('/trending', StocksController.getTrending);
router.get('/:symbol', StocksController.getStockDetails);

export default router;
