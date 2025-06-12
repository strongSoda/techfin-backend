import { Request, Response, Router } from 'express';
import { login, register } from '../controllers/userController';
import { validateBody } from '../middlewares/validate';
import { authSchema } from '../schemas/authSchema';

const router = Router();


console.log('typeof login:', typeof login); 

router.post('/register', validateBody(authSchema), (req: Request, res: Response)=> {register(req, res)});
router.post('/login', validateBody(authSchema), (req: Request, res: Response)=> {login(req, res)});

export default router;
