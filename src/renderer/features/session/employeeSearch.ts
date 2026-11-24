import type { Employee } from '../../../shared/contracts/staff';

export function searchEmployees(employees: Employee[], query: string): Employee[] {
  const terms = query.trim().replace(/^#\s*/, '').toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return employees.filter(({ name, id }) => {
    const searchable = `${name} ${id}`.toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}
