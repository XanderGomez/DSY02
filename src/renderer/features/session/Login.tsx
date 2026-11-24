import { useRef, useState } from 'react';
import type { Employee } from '../../../shared/contracts/staff';
import EmployeePicker from './EmployeePicker';

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </svg>
  );
}

type LoginProps = {
  employees: Employee[];
  // Supply consecutive failures when authentication is connected.
  failedLoginAttempts?: number;
  onLogin?: (employee: Employee) => void;
};

export default function Login({ employees, failedLoginAttempts = 0, onLogin }: LoginProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const pinRef = useRef<HTMLInputElement>(null);
  const employee = employees.find(({ id }) => id === employeeId);

  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
      <section aria-labelledby="login-title" className="mx-auto w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-xl shadow-emerald-950/5">
        <div className="p-6 sm:p-9">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><LockIcon /></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Staff access</span>
          </div>
          <h1 id="login-title" className="text-2xl font-semibold tracking-tight text-stone-900 focus:outline-none sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">Select your account and enter your PIN to start your session.</p>

          <form className="mt-7 space-y-6" onSubmit={(event) => {
            event.preventDefault();
            if (employee && /^\d+$/.test(pin)) onLogin?.(employee);
          }}>
            <EmployeePicker employees={employees} value={employee} onChange={(next) => {
              setEmployeeId(next?.id ?? '');
              setPin('');
              setShowPin(false);
              if (next) pinRef.current?.focus();
            }} />

            <div>
              <label className="block text-sm font-medium text-stone-800" htmlFor="employee-pin">Employee PIN</label>
              <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-stone-300 bg-white px-3 text-stone-400 shadow-sm transition focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/10">
                <LockIcon />
                <input
                  ref={pinRef}
                  aria-describedby="pin-help"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  id="employee-pin"
                  inputMode="numeric"
                  onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))}
                  pattern="[0-9]+"
                  required
                  placeholder="Enter your PIN"
                  spellCheck={false}
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                />
                <button type="button" aria-label={showPin ? 'Hide PIN' : 'Show PIN'} onClick={() => setShowPin((current) => !current)} className="grid size-9 shrink-0 place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-emerald-700">
                  <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{showPin && <path d="m3 3 18 18" />}</svg>
                </button>
              </div>
              <p id="pin-help" className="mt-2 text-xs text-stone-500">Use the numeric PIN for your employee account.</p>
            </div>

            <button disabled={!pin || !employee || !onLogin} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none" type="submit">
              Sign in
              <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
            </button>
          </form>

          {failedLoginAttempts >= 2 && <aside role="status" className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-medium">Need help signing in?</p>
            <p className="mt-1">Ask your manager for your employee PIN.</p>
          </aside>}
        </div>
        <div className="rounded-b-2xl border-t border-stone-100 bg-stone-50 px-6 py-4 sm:px-9">
          <p className="text-xs leading-5 text-stone-500"><span className="font-medium text-stone-700">Demo mode.</span> Any numeric PIN works. Authentication is not connected.</p>
        </div>
      </section>
    </main>
  );
}
