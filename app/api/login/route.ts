import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Verifies the admin or kitchen password on the server so it never ships in
 * the browser bundle. Passwords come from ADMIN_PASSWORD / KITCHEN_PASSWORD.
 * (The old NEXT_PUBLIC_* names are still read so existing deployments keep
 * working.) If a password is not configured, login for that role is disabled.
 */
export const runtime = 'nodejs';

function expected(role: 'admin' | 'kitchen'): string | undefined {
  return role === 'admin'
    ? process.env.ADMIN_PASSWORD ?? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    : process.env.KITCHEN_PASSWORD ?? process.env.NEXT_PUBLIC_KITCHEN_PASSWORD;
}

function matches(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(request: Request) {
  let body: { role?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  if (body.role !== 'admin' && body.role !== 'kitchen') {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const secret = expected(body.role);
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: `${body.role} login is not configured on this server` },
      { status: 503 }
    );
  }

  if (typeof body.password !== 'string' || !matches(body.password, secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
