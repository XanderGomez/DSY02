import type { Employee, StoreLocation } from './session';

type AppHeaderProps = {
  store: StoreLocation | null;
  employee: Employee | null;
  backLabel?: string;
  onBack?: () => void;
  onLogout: () => void;
  onManager: () => void;
  isManagerPage: boolean;
};

export default function AppHeader({ store, employee, backLabel, onBack, onLogout, onManager, isManagerPage }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 shadow-sm">
      <div className="flex min-h-16 items-center justify-between gap-3 bg-emerald-950 px-5 py-2 text-white sm:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-lime-300" />
          Dragon&apos;s Lair
        </span>
        {employee ? (
          <nav aria-label="Staff navigation" className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={onManager} aria-current={isManagerPage ? 'page' : undefined} className="min-h-11 rounded-md px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-lime-300">Manager</button>
            <button type="button" onClick={onLogout} className="min-h-11 rounded-md border border-emerald-700 px-3 py-2 text-sm font-medium hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-lime-300">Log out</button>
          </nav>
        ) : <span className="text-sm text-emerald-100">Staff login</span>}
      </div>
      <div aria-label="Current store and employee" className={`grid grid-cols-2 items-center gap-4 px-5 py-3 sm:px-8 ${store?.bannerClass ?? 'bg-stone-200 text-stone-800'}`}>
        <div className="min-w-0">
          <p className="text-xs opacity-80">Store location</p>
          <p className="break-words text-sm font-semibold">{store?.name ?? 'Select a location'}</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-xs opacity-80">{employee ? 'Logged in as' : 'Employee'}</p>
          <p className="break-words text-sm font-semibold">{employee?.name ?? 'Not logged in'}</p>
        </div>
      </div>
      {onBack && backLabel && <nav aria-label="Back navigation" className="border-b border-emerald-200 bg-[#f3f8f1] px-3 py-1 sm:px-6">
        <button type="button" onClick={onBack} className="flex min-h-11 items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-800">
          <svg aria-hidden="true" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
          {backLabel}
        </button>
      </nav>}
    </header>
  );
}
