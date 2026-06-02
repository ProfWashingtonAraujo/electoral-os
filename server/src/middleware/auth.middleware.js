import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'electoral-os-secret-key-2025';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}
//# sourceMappingURL=auth.middleware.js.map