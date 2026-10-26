import { useEffect, useState } from 'react';
import App from './App';
import CustomerAccount, { type CustomerAccountDetails } from './CustomerAccount';
import Login from './Login';
import ManagerPage from './ManagerPage';
import TradeInPage from './TradeInPage';
import TradeOutPage from './TradeOutPage';
import { parseRoute, routePath, type Route } from './routes';

const demoCustomers: CustomerAccountDetails[] = [
  { id: 1, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(402) 555-0142', creditBalance: 125.5 },
  { id: 2, name: 'Noah Williams', email: 'noah.williams@email.com', phone: '(402) 555-0188', creditBalance: 48 },
  { id: 3, name: 'Ava Martinez', email: 'ava.martinez@email.com', phone: '(402) 555-0126', creditBalance: 0 },
];

export default function AppRouter() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customers, setCustomers] = useState(demoCustomers);
  const [query, setQuery] = useState('');
  const requestedRoute = parseRoute(hash);
  const selectedCustomer = requestedRoute && 'customerId' in requestedRoute
    ? customers.find(({ id }) => id === requestedRoute.customerId)
    : undefined;
  const route: Route = !isLoggedIn
    ? { page: 'login' }
    : !requestedRoute || requestedRoute.page === 'login' || ('customerId' in requestedRoute && !selectedCustomer)
      ? { page: 'search' }
      : requestedRoute;
  const path = routePath(route);

  function navigate(next: Route) {
    window.location.hash = routePath(next);
    setHash(window.location.hash);
  }

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    if (window.location.hash !== `#${path}`) {
      window.history.replaceState(null, '', `#${path}`);
      setHash(`#${path}`);
    }
    const titles = { login: 'Staff login', search: 'Find a customer', manager: 'Trade activity', account: 'Customer account', 'trade-in': 'Trade in', 'trade-out': 'Trade out' };
    document.title = `${titles[route.page]} | Dragon's Lair`;
    window.scrollTo(0, 0);
    const heading = document.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, [path, route.page]);

  const backToSearch = () => navigate({ page: 'search' });
  if (route.page === 'login') {
    return <Login onLogin={() => { setIsLoggedIn(true); backToSearch(); }} />;
  }
  if (route.page === 'manager') return <ManagerPage onBackToSearch={backToSearch} />;
  if (selectedCustomer && 'customerId' in route) {
    const backToAccount = () => navigate({ page: 'account', customerId: selectedCustomer.id });
    if (route.page === 'trade-in') return <TradeInPage customer={selectedCustomer} onBackToAccount={backToAccount} />;
    if (route.page === 'trade-out') return <TradeOutPage customer={selectedCustomer} onBackToAccount={backToAccount} />;
    return <CustomerAccount customer={selectedCustomer} onBackToSearch={backToSearch}
      onTradeIn={() => navigate({ page: 'trade-in', customerId: selectedCustomer.id })}
      onTradeOut={() => navigate({ page: 'trade-out', customerId: selectedCustomer.id })} />;
  }
  return <App customers={customers} query={query} onQueryChange={setQuery}
    onSelectCustomer={(customer) => navigate({ page: 'account', customerId: customer.id })}
    onCreateCustomer={(customer) => {
      setCustomers((current) => [customer, ...current]);
      navigate({ page: 'account', customerId: customer.id });
    }}
    onManager={() => navigate({ page: 'manager' })}
    onLogout={() => { setIsLoggedIn(false); setQuery(''); navigate({ page: 'login' }); }} />;
}
