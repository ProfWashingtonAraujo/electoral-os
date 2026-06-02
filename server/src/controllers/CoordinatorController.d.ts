import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare class CoordinatorController {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: AuthRequest, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CoordinatorController.d.ts.map