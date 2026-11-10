export type Route =
  | { page: 'store' | 'login' | 'search' | 'manager' }
  | { page: 'account' | 'trade-in' | 'trade-out'; customerId: number };

export function parseRoute(hash: string): Route | null {
  const path = hash.replace(/^#/, '') || '/login';
  if (path === '/store') return { page: 'store' };
  if (path === '/login') return { page: 'login' };
  if (path === '/search') return { page: 'search' };
  if (path === '/manager') return { page: 'manager' };
  const match = /^\/customers\/(\d+)(?:\/(trade-in|trade-out))?$/.exec(path);
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null;
  return { page: (match[2] as 'trade-in' | 'trade-out') || 'account', customerId: Number(match[1]) };
}

// Explicit destinations keep Back inside the current session, including deep links.
export function backDestination(route: Route): { route: Route; label: string } | null {
  if (route.page === 'login') return { route: { page: 'store' }, label: 'Back to store selection' };
  if (route.page === 'trade-in' || route.page === 'trade-out') {
    return { route: { page: 'account', customerId: route.customerId }, label: 'Back to customer account' };
  }
  if (route.page === 'account' || route.page === 'manager') {
    return { route: { page: 'search' }, label: 'Back to customer search' };
  }
  return null;
}

export function routePath(route: Route): string {
  if ('customerId' in route) {
    return `/customers/${route.customerId}${route.page === 'account' ? '' : `/${route.page}`}`;
  }
  return `/${route.page}`;
}
