import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare class AuditController {
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=AuditController.d.ts.map