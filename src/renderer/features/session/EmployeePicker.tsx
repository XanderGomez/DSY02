import { useEffect, useId, useRef, useState } from 'react';
import type { Employee } from '../../../shared/contracts/staff';
import { searchEmployees } from './employeeSearch';

type EmployeePickerProps = {
  employees: Employee[];
  value?: Employee;
  onChange: (employee: Employee | undefined) => void;
};

export default function EmployeePicker({ employees, value, onChange }: EmployeePickerProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeOptionRef = useRef<HTMLLIElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const matches = searchEmployees(employees, value ? '' : query);
  const activeOption = open && matches[activeIndex] ? `${id}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (activeOption) activeOptionRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeOption]);

  function selectEmployee(employee: Employee) {
    setQuery('');
    setOpen(false);
    setActiveIndex(-1);
    onChange(employee);
  }

  return (
    <div onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label htmlFor={id} className="block text-sm font-medium text-stone-800">Employee</label>
      <div className="relative mt-2">
        <div className="flex min-h-12 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 shadow-sm transition focus-within:border-emerald-700 focus-within:ring-3 focus-within:ring-emerald-700/10">
          <svg aria-hidden="true" className="size-4 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? `${id}-list` : undefined}
            aria-activedescendant={activeOption}
            aria-describedby={`${id}-help`}
            aria-required="true"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search name or employee ID"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
            value={value?.name ?? query}
            onFocus={() => { if (!value) setOpen(true); }}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(undefined);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setOpen(true);
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                setActiveIndex((current) => !open || current < 0
                  ? direction === 1 ? 0 : matches.length - 1
                  : Math.max(0, Math.min(matches.length - 1, current + direction)));
              } else if (event.key === 'Enter') {
                // Choosing an account must never submit the PIN form implicitly.
                event.preventDefault();
                if (open && matches[activeIndex]) selectEmployee(matches[activeIndex]);
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setOpen(false);
                setActiveIndex(-1);
              }
            }}
          />
          {(value || query) && <button
            type="button"
            aria-label="Clear employee search"
            className="grid size-9 shrink-0 place-items-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-emerald-700"
            onClick={() => {
              setQuery('');
              onChange(undefined);
              setActiveIndex(-1);
              setOpen(true);
              inputRef.current?.focus();
            }}
          ><svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg></button>}
          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? 'Hide employees' : 'Show employees'}
            aria-expanded={open}
            aria-controls={open ? `${id}-list` : undefined}
            className="grid size-9 shrink-0 place-items-center rounded-md text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const nextOpen = !open;
              inputRef.current?.focus();
              setOpen(nextOpen);
              setActiveIndex(-1);
            }}
          ><svg aria-hidden="true" className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></button>
        </div>

        {open && <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl shadow-stone-900/10">
          <div className="border-b border-stone-100 px-3 py-2.5 text-xs font-medium text-stone-500" role="status">
            {matches.length ? `${matches.length} employee${matches.length === 1 ? '' : 's'} available` : employees.length ? 'No employees found' : 'No employee accounts available'}
          </div>
          <ul id={`${id}-list`} role="listbox" aria-label="Employees" className="max-h-56 scroll-py-1 overflow-y-auto overscroll-contain p-1">
            {matches.map((employee, index) => <li
              key={employee.id}
              id={`${id}-option-${index}`}
              ref={index === activeIndex ? activeOptionRef : undefined}
              role="option"
              aria-selected={index === activeIndex}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm hover:bg-emerald-50 ${index === activeIndex ? 'bg-emerald-50 text-emerald-950' : 'text-stone-800'}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectEmployee(employee)}
            >
              <span className="min-w-0 break-words font-medium">{employee.name}</span>
              <span className="shrink-0 text-xs tabular-nums text-stone-500">#{employee.id}</span>
            </li>)}
          </ul>
          {!matches.length && <p className="px-4 pb-4 pt-2 text-sm text-stone-500">{employees.length ? 'Try a different name or employee ID.' : 'Ask your manager to check the staff directory.'}</p>}
        </div>}
      </div>
      <p id={`${id}-help`} className="mt-2 text-xs text-stone-500">
        {value ? `Employee #${value.id} selected` : 'Search for your account, then select it to continue.'}
        <span className="sr-only"> Use the up and down arrow keys to browse, Enter to select, and Escape to close the results.</span>
      </p>
    </div>
  );
}
