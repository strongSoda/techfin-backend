import { Request, Response, Router } from 'express';
import { login, register } from '../controllers/userController';

const router = Router();


console.log('typeof login:', typeof login); 

router.post('/register', (req: Request, res: Response)=> {register(req, res)});
router.post('/login', (req: Request, res: Response)=> {login(req, res)});

export default router;
