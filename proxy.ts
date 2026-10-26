import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  let isAuthenticated = Boolean(accessToken);
  const newCookies: ReturnType<typeof parseSetCookie>[] = [];

  // accessToken закінчився, але є refreshToken: пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      const setCookie = res.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          if (parsed.value) {
            newCookies.push(parsed);
          }
        }
        isAuthenticated = res.data.success;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else if (newCookies.length > 0) {
    // передаємо оновлені токени далі серверним компонентам через копію заголовків
    const requestHeaders = new Headers(request.headers);
    const cookieHeader = [
      request.headers.get('cookie'),
      ...newCookies.map(cookie => `${cookie.name}=${cookie.value}`),
    ]
      .filter(Boolean)
      .join('; ');
    requestHeaders.set('cookie', cookieHeader);
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    response = NextResponse.next();
  }

  // нові токени записуються тільки у відповідь
  for (const cookie of newCookies) {
    response.cookies.set(cookie.name, cookie.value as string, cookie);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
