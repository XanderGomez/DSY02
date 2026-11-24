import { useState } from 'react';
import { demoEmployees, type Employee } from './session';

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  );
}

type LoginProps = {
  // Supply consecutive failures when authentication is connected.
  failedLoginAttempts?: number;
  onLogin?: (employee: Employee) => void;
};

function Login({ failedLoginAttempts = 0, onLogin }: LoginProps) {
  const [pin, setPin] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const employee = demoEmployees.find(({ id }) => id === employeeId);

  return (
    <div className="bg-[#e6f0e5] text-stone-900">
      <main className="px-4 pb-12 sm:px-6">
        <section aria-labelledby="login-title" className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] px-5 pb-12 pt-8 shadow-sm shadow-emerald-950/5 sm:mt-12 sm:px-8 sm:pb-16 sm:pt-10">
          <div className="max-w-2xl">
            <h1 id="login-title" className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-stone-600">Choose your demo employee account and enter a PIN to log in.</p>

            <form className="mt-8" onSubmit={(event) => { event.preventDefault(); if (pin && employee) onLogin?.(employee); }}>
              <label className="block text-sm font-medium text-emerald-950" htmlFor="demo-employee">Demo employee</label>
              <select id="demo-employee" required value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className="mb-5 mt-2 min-h-12 w-full rounded-lg border border-emerald-700 bg-white px-3 text-base text-emerald-950 focus-visible:outline-2 focus-visible:outline-emerald-800">
                <option value="" disabled>Select your employee account</option>
                {demoEmployees.map(({ id, name }) => <option key={id} value={id}>{name} (#{id})</option>)}
              </select>
              <label className="block text-sm font-medium text-emerald-950" htmlFor="employee-pin">Employee PIN</label>
              <div className="mt-2 flex min-h-14 items-center gap-3 rounded-lg border-2 border-emerald-700 bg-emerald-50 px-4 text-emerald-800 shadow-sm shadow-emerald-950/5 focus-within:ring-4 focus-within:ring-emerald-800/20">
                <LockIcon />
                <input
                  aria-describedby="pin-help"
                  autoComplete="off"
                  className="min-w-0 w-full border-0 bg-transparent py-3 text-base text-emerald-950 outline-none placeholder:text-stone-400"
                  id="employee-pin"
                  inputMode="numeric"
                  onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))}
                  pattern="[0-9]*"
                  required
                  placeholder="Enter your PIN"
                  spellCheck={false}
                  type="password"
                  value={pin}
                />
              </div>
              <p id="pin-help" className="mt-2 text-xs text-stone-500">Demo: enter any numeric PIN. Authentication is not connected.</p>
              <div className="mt-4 flex justify-end">
                <button disabled={!pin || !employee || !onLogin} className="min-h-11 min-w-28 rounded-md border border-emerald-700/40 bg-emerald-100 px-5 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-50" type="submit">
                  Log in
                </button>
              </div>
            </form>

            {failedLoginAttempts >= 2 && (
              <aside role="status" className="mt-10 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-100/80 px-4 py-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-900 [&_svg]:size-4">
                  <LockIcon />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-emerald-950">Need a PIN?</h2>
                  <p className="mt-1 text-sm text-stone-600">Ask your manager for your employee PIN.</p>
                </div>
              </aside>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
