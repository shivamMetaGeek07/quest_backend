import express from 'express';
import { getAllKols, getKolById, createKol } from '../../controllers/kols/kols';

const kolsRouter = express.Router();

kolsRouter.get('/getAllKols', getAllKols);
kolsRouter.get('/:id', getKolById);
kolsRouter.post('/create', createKol);

export default kolsRouter;