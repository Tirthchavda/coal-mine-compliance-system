import { Router } from 'express';
import { generateReport, getFormIVReport } from '../controllers/reportController.js';

const router = Router();

router.get('/generate', generateReport);
router.get('/form-iv/:mineId', getFormIVReport);

export default router;
