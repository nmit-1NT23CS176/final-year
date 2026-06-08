import { Router } from 'express';
import { z } from 'zod';
import { WatchlistController } from '../controllers/watchlist.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

const addSchema = z.object({
  stockSymbol: z.string().min(1).max(20).transform(s => s.toUpperCase())
});

router.use(authenticate); // Apply authentication to all watchlist routes

router.get('/', WatchlistController.getWatchlist);
router.post('/', validate(addSchema), WatchlistController.addStock);
router.delete('/:id', WatchlistController.removeStock);

export default router;
