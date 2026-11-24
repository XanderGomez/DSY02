import { useEffect, useState, type ReactNode } from 'react';
import CustomerSearch from '../features/customers/CustomerSearch';
import AppHeader from '../components/AppHeader';
import CustomerAccount from '../features/customers/CustomerAccount';
import Login from '../features/session/Login';
import TransactionHistory from '../features/transactions/TransactionHistory';
import ManagerAnalytics from '../features/manager/ManagerAnalytics';
import ManagerPage from '../features/manager/ManagerPage';
import TradeInPage from '../features/trades/TradeInPage';
import TradeOutPage from '../features/trades/TradeOutPage';
import StoreSelection from '../features/session/StoreSelection';
import { backDestination, parseRoute, routePath, type Route } from './routes';
import type { Employee, StoreDirectory, StoreLocation } from '../../shared/contracts/staff';

import type { CreditSession, TradeFields, TradeRequest } from '../../shared/contracts/credit';
import { toDisplayTrade } from '../features/transactions/transactions';

export default function AppRouter({ credit, directory }: { credit: CreditSession; directory: StoreDirectory }) {
  const [hash, setHash] = useState(() => window.location.hash);
  const [store, setStore] = useState<StoreLocation | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [{ customers, transactions }, setSnapshot] = useState(() => credit.snapshot());
  const trades = transactions.map(toDisplayTrade);
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
    const titles = { store: 'Choose your store', login: 'Staff login', search: 'Find a customer', manager: 'Trade activity', analytics: 'Trade analytics', history: 'Transaction history', account: 'Customer account', 'trade-in': 'Trade in', 'trade-out': 'Trade out' };
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
    content = <StoreSelection stores={directory.stores} onSelect={(location) => { setStore(location); navigate({ page: 'login' }); }} />;
  } else if (route.page === 'login') {
    content = <Login employees={directory.employees} onLogin={(staff) => { setEmployee(staff); backToSearch(); }} />;
  } else if (route.page === 'history') {
    content = <TransactionHistory trades={trades} />;
  } else if (route.page === 'analytics') {
    content = <ManagerAnalytics trades={trades} />;
  } else if (route.page === 'manager') {
    content = <ManagerPage trades={trades} />;
  } else if (store && employee && selectedCustomer && 'customerId' in route) {
    const submit = (kind: TradeRequest['kind'], fields: TradeFields) => {
      credit.recordTrade({ ...fields, kind, customerId: selectedCustomer.id, store: store.name, employee: employee.name, employeeId: employee.id });
      setSnapshot(credit.snapshot());
      navigate({ page: 'account', customerId: selectedCustomer.id });
    };
    if (route.page === 'trade-in') content = <TradeInPage onSubmit={(fields) => submit('Trade in', fields)} key={selectedCustomer.id} customer={selectedCustomer} />;
    else if (route.page === 'trade-out') content = <TradeOutPage onSubmit={(fields) => submit('Trade out', fields)} key={selectedCustomer.id} customer={selectedCustomer} />;
    else content = (
      <CustomerAccount customer={selectedCustomer} trades={trades.filter((trade) => trade.customerId === selectedCustomer.id)}
        onTradeIn={() => navigate({ page: 'trade-in', customerId: selectedCustomer.id })}
        onTradeOut={() => navigate({ page: 'trade-out', customerId: selectedCustomer.id })} />
    );
  } else {
    content = <CustomerSearch customers={customers} query={query} onQueryChange={setQuery}
      onSelectCustomer={(customer) => navigate({ page: 'account', customerId: customer.id })}
      onCreateCustomer={(customer) => {
        credit.addCustomer(customer);
        setSnapshot(credit.snapshot());
        navigate({ page: 'account', customerId: customer.id });
      }} />;
  }
  return (
    <div className="min-h-screen bg-[#e6f0e5] text-stone-900">
      <AppHeader store={store} employee={employee} isManagerPage={route.page === 'manager' || route.page === 'analytics' || route.page === 'history'}
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
