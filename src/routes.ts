export type Route =
  | { page: 'login' | 'search' | 'manager' }
  | { page: 'account' | 'trade-in' | 'trade-out'; customerId: number };

export function parseRoute(hash: string): Route | null {
  const path = hash.replace(/^#/, '') || '/login';
  if (path === '/login') return { page: 'login' };
  if (path === '/search') return { page: 'search' };
  if (path === '/manager') return { page: 'manager' };
  const match = /^\/customers\/(\d+)(?:\/(trade-in|trade-out))?$/.exec(path);
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null;
  return { page: (match[2] as 'trade-in' | 'trade-out') || 'account', customerId: Number(match[1]) };
}

export function routePath(route: Route): string {
  if ('customerId' in route) {
    return `/customers/${route.customerId}${route.page === 'account' ? '' : `/${route.page}`}`;
  }
  return `/${route.page}`;
}
