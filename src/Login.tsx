import { useState } from 'react';

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
};

function Login({ failedLoginAttempts = 0 }: LoginProps) {
  const [pin, setPin] = useState('');

  return (
    <div className="min-h-screen bg-[#e6f0e5] text-stone-900">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-emerald-950 bg-emerald-950 px-5 text-white sm:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />
          Dragon&apos;s Lair
        </span>
        <span className="text-sm text-emerald-100">Staff login</span>
      </header>

      <main className="px-4 pb-12 sm:px-6">
        <section aria-labelledby="login-title" className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] px-5 pb-12 pt-8 shadow-sm shadow-emerald-950/5 sm:mt-12 sm:px-8 sm:pb-16 sm:pt-10">
          <div className="max-w-2xl">
            <h1 id="login-title" className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-stone-600">Enter your employee PIN to log in.</p>

            <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
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
                  placeholder="Enter your PIN"
                  spellCheck={false}
                  type="password"
                  value={pin}
                />
              </div>
              <p id="pin-help" className="mt-2 text-xs text-stone-500">Use the PIN assigned to your staff account.</p>
              <div className="mt-4 flex justify-end">
                {/* Visual preview only; authentication will be connected later. */}
                <button disabled className="min-h-11 min-w-28 cursor-not-allowed rounded-md border border-emerald-700/40 bg-emerald-100 px-5 py-2 text-sm font-medium text-emerald-950" type="button">
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
