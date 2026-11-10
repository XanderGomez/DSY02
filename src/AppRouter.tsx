import { useEffect, useState, type ReactNode } from 'react';
import App from './App';
import AppHeader from './AppHeader';
import CustomerAccount, { type CustomerAccountDetails } from './CustomerAccount';
import Login from './Login';
import ManagerPage from './ManagerPage';
import TradeInPage from './TradeInPage';
import TradeOutPage from './TradeOutPage';
import StoreSelection from './StoreSelection';
import { backDestination, parseRoute, routePath, type Route } from './routes';
import type { Employee, StoreLocation } from './session';

const demoCustomers: CustomerAccountDetails[] = [
  { id: 1, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(402) 555-0142', creditBalance: 125.5 },
  { id: 2, name: 'Noah Williams', email: 'noah.williams@email.com', phone: '(402) 555-0188', creditBalance: 48 },
  { id: 3, name: 'Ava Martinez', email: 'ava.martinez@email.com', phone: '(402) 555-0126', creditBalance: 0 },
];

export default function AppRouter() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [store, setStore] = useState<StoreLocation | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [customers, setCustomers] = useState(demoCustomers);
  const [query, setQuery] = useState('');
  const requestedRoute = parseRoute(hash);
  const selectedCustomer = requestedRoute && 'customerId' in requestedRoute
    ? customers.find(({ id }) => id === requestedRoute.customerId)
    : undefined;
  const route: Route = !store
    ? { page: 'store' }
    : !employee
      ? { page: 'login' }
      : !requestedRoute || requestedRoute.page === 'login' || requestedRoute.page === 'store' || ('customerId' in requestedRoute && !selectedCustomer)
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
    const titles = { store: 'Choose your store', login: 'Staff login', search: 'Find a customer', manager: 'Trade activity', account: 'Customer account', 'trade-in': 'Trade in', 'trade-out': 'Trade out' };
    document.title = `${titles[route.page]} | Dragon's Lair`;
    window.scrollTo(0, 0);
    const heading = document.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, [path, route.page]);

  const backToSearch = () => navigate({ page: 'search' });
  const back = backDestination(route);
  let content: ReactNode;
  if (route.page === 'store') {
    content = <StoreSelection onSelect={(location) => { setStore(location); navigate({ page: 'login' }); }} />;
  } else if (route.page === 'login') {
    content = <Login onLogin={(staff) => { setEmployee(staff); backToSearch(); }} />;
  } else if (route.page === 'manager') {
    content = <ManagerPage />;
  } else if (selectedCustomer && 'customerId' in route) {
    if (route.page === 'trade-in') content = <TradeInPage key={selectedCustomer.id} customer={selectedCustomer} />;
    else if (route.page === 'trade-out') content = <TradeOutPage key={selectedCustomer.id} customer={selectedCustomer} />;
    else content = (
      <CustomerAccount customer={selectedCustomer}
        onTradeIn={() => navigate({ page: 'trade-in', customerId: selectedCustomer.id })}
        onTradeOut={() => navigate({ page: 'trade-out', customerId: selectedCustomer.id })} />
    );
  } else {
    content = <App customers={customers} query={query} onQueryChange={setQuery}
      onSelectCustomer={(customer) => navigate({ page: 'account', customerId: customer.id })}
      onCreateCustomer={(customer) => {
        setCustomers((current) => [customer, ...current]);
        navigate({ page: 'account', customerId: customer.id });
      }} />;
  }
  return (
    <div className="min-h-screen bg-[#e6f0e5] text-stone-900">
      <AppHeader store={store} employee={employee} isManagerPage={route.page === 'manager'}
        backLabel={back?.label}
        onBack={back ? () => {
          if (back.route.page === 'store') setStore(null);
          navigate(back.route);
        } : undefined}
        onManager={() => navigate({ page: 'manager' })}
        onLogout={() => { setEmployee(null); setQuery(''); navigate({ page: 'login' }); }} />
      {content}
    </div>
  );
}
