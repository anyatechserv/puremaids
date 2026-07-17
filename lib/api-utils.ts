import { z } from 'zod';

export interface ApiError {
  error: string;
  code?: string;
}

export function safeJsonParse<T>(raw: string, schema: z.ZodSchema<T>): { success: true; data: T } | { success: false; error: string } {
  try {
    const json = JSON.parse(raw);
    const result = schema.safeParse(json);
    if (!result.success) {
      const first = result.error.issues[0];
      return { success: false, error: first ? `${first.path.join('.')}: ${first.message}` : 'Validation failed' };
    }
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }
}

export function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function successResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
