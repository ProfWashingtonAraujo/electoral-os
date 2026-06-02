import { mkdir, appendFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const logFilePath = resolve(process.cwd(), 'data', 'audit-log.jsonl');
export async function appendAuditLog(entry) {
    const payload = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
        ...entry,
    };
    await mkdir(dirname(logFilePath), { recursive: true });
    await appendFile(logFilePath, `${JSON.stringify(payload)}\n`, 'utf8');
    return payload;
}
export async function listAuditLogs(limit = 200) {
    try {
        const content = await readFile(logFilePath, 'utf8');
        return content
            .split('\n')
            .filter(Boolean)
            .map((line) => JSON.parse(line))
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
            .slice(0, limit);
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=auditLog.js.map