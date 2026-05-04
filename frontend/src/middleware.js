import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cookie se token nikalna
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Sirf in folders ko protect karna hai
  const protectedPaths = ['/booking', '/dashboard'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Agar user protected page par jane ki koshish kare aur token na ho
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/booking/:path*', '/dashboard/:path*'], // Flights yahan nahi hona chahiye
};