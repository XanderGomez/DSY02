import { useState, type FormEvent } from 'react';

const categoryOptions: Record<string, string[]> = {
  'Trading cards': ['Magic: The Gathering', 'Pokémon', 'Yu-Gi-Oh!', 'Other trading cards'],
  'Board games': ['Strategy', 'Party games', 'Other board games'],
  'Roleplaying games': ['Rulebooks', 'Dice', 'Other roleplaying items'],
  Miniatures: ['Figures', 'Paints & supplies', 'Other miniatures'],
  Accessories: ['Card sleeves', 'Storage', 'Other accessories'],
};
const categories = Object.keys(categoryOptions);
const fieldClass = 'mt-2 block w-full rounded-md border border-emerald-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20';
const buttonClass = 'rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800';
function filterClass(selected: boolean) {
  return `min-h-11 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-emerald-200 bg-white text-emerald-950 hover:bg-emerald-100'}`;
}

export default function TradeInPage() {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [showMoreSubcategories, setShowMoreSubcategories] = useState(false);
  const [subcategoryUsage, setSubcategoryUsage] = useState<Record<string, number>>({});
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>({});
  // Use reviewed forms in this session until saved trade history is available.
  const rankedCategories = [...categories].sort((a, b) => (categoryUsage[b] ?? 0) - (categoryUsage[a] ?? 0));
  const topCategories = rankedCategories.slice(0, 3);
  const moreCategories = rankedCategories.slice(3);
  const subcategories = [...(categoryOptions[category] ?? [])].sort((a, b) => (subcategoryUsage[`${category}:${b}`] ?? 0) - (subcategoryUsage[`${category}:${a}`] ?? 0));
  const topSubcategories = subcategories.slice(0, 3);
  const moreSubcategories = subcategories.slice(3);

  function clearSelection() {
    setError('');
    setReviewed(false);
  }

  function reviewForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewed(false);
    if (!category || !subcategory || !itemName.trim()) {
      setError('Choose a category and subcategory, and enter the item name.');
      return;
    }
    const value = amount.trim();
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setError('Enter a positive store credit amount with up to two decimal places, such as 12.50.');
      return;
    }
    const [dollars, fractionalCents = ''] = value.split('.');
    const cents = Number(dollars) * 100 + Number(fractionalCents.padEnd(2, '0'));
    if (!Number.isSafeInteger(cents) || cents < 1) {
      setError('Enter a valid store credit amount of at least $0.01.');
      return;
    }
    setError('');
    setAmount(`${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`);
    if (!reviewed) setCategoryUsage((current) => ({ ...current, [category]: (current[category] ?? 0) + 1 }));
    if (!reviewed) setSubcategoryUsage((current) => ({ ...current, [`${category}:${subcategory}`]: (current[`${category}:${subcategory}`] ?? 0) + 1 }));
    setReviewed(true);
  }

  function resetForm() {
    setCategory('');
    setSubcategory('');
    setItemName('');
    setDescription('');
    setAmount('');
    setShowMoreCategories(false);
    setShowMoreSubcategories(false);
    clearSelection();
  }

  return (
    <main className="min-h-screen bg-[#e6f0e5] pb-12 text-stone-900">
      <header className="flex h-16 items-center justify-between bg-emerald-950 px-5 text-white sm:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight"><span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />Dragon&apos;s Lair</span>
        <span className="text-xs text-emerald-100">Trade in</span>
      </header>
      <section className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] p-5 shadow-sm sm:mt-12 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Trade in</h1>
        <p className="mt-2 text-sm text-stone-600">Describe the item the customer is trading in and enter the store credit offered.</p>
        <form className="mt-7" onSubmit={reviewForm}>
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-emerald-950">Category</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {topCategories.map((value) => <button type="button" key={value} className={filterClass(category === value)} aria-pressed={category === value} onClick={() => { setCategory(value); setSubcategory(''); setShowMoreSubcategories(false); clearSelection(); }}>{value}</button>)}
              </div>
              <button type="button" className="mt-2 rounded px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2" aria-expanded={showMoreCategories} aria-controls="more-trade-in-categories" onClick={() => setShowMoreCategories((current) => !current)}>{showMoreCategories ? 'Show less' : 'Show more'}</button>
              <div id="more-trade-in-categories" hidden={!showMoreCategories} className="mt-1 max-w-xs rounded-md border border-emerald-200 bg-white p-1">
                {moreCategories.map((value) => <button type="button" key={value} className={`block min-h-11 w-full rounded px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-emerald-800 ${category === value ? 'bg-emerald-800 text-white' : 'text-emerald-950 hover:bg-emerald-100'}`} aria-pressed={category === value} onClick={() => { setCategory(value); setSubcategory(''); setShowMoreSubcategories(false); clearSelection(); }}>{value}</button>)}
              </div>
              {!showMoreCategories && moreCategories.includes(category) && <p className="mt-1 text-sm text-emerald-900">Selected: {category}</p>}
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-emerald-950">Subcategory</legend>
              {category ? <>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {topSubcategories.map((value) => <button type="button" key={value} className={filterClass(subcategory === value)} aria-pressed={subcategory === value} onClick={() => { setSubcategory(value); clearSelection(); }}>{value}</button>)}
                </div>
                {moreSubcategories.length > 0 && <>
                  <button type="button" className="mt-2 rounded px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2" aria-expanded={showMoreSubcategories} aria-controls="more-trade-in-subcategories" onClick={() => setShowMoreSubcategories((current) => !current)}>{showMoreSubcategories ? 'Show less' : 'Show more'}</button>
                  <div id="more-trade-in-subcategories" hidden={!showMoreSubcategories} className="mt-1 max-w-xs rounded-md border border-emerald-200 bg-white p-1">
                    {moreSubcategories.map((value) => <button type="button" key={value} className={`block min-h-11 w-full rounded px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-emerald-800 ${subcategory === value ? 'bg-emerald-800 text-white' : 'text-emerald-950 hover:bg-emerald-100'}`} aria-pressed={subcategory === value} onClick={() => { setSubcategory(value); clearSelection(); }}>{value}</button>)}
                  </div>
                </>}
                {!showMoreSubcategories && moreSubcategories.includes(subcategory) && <p className="mt-1 text-sm text-emerald-900">Selected: {subcategory}</p>}
              </> : <p className="mt-2 text-sm text-stone-500">Choose a category to see its subcategories.</p>}
            </fieldset>
          <label className="mt-6 block text-sm font-medium text-emerald-950" htmlFor="trade-in-item-name">Item name <span className="text-red-700">*</span></label>
          <input id="trade-in-item-name" className={fieldClass} required maxLength={200} placeholder="Enter the item being traded in" value={itemName} onChange={(event) => { setItemName(event.target.value); clearSelection(); }} />
          <label className="mt-5 block text-sm font-medium text-emerald-950" htmlFor="trade-in-description">Condition / notes <span className="font-normal text-stone-500">(optional)</span></label>
          <textarea id="trade-in-description" className={fieldClass} rows={3} maxLength={2000} placeholder="Condition, edition, missing pieces, or other details about the item" value={description} onChange={(event) => { setDescription(event.target.value); clearSelection(); }} />
          <label className="mt-5 block text-sm font-medium text-emerald-950" htmlFor="trade-in-credit-amount">Store credit offered (USD) <span className="text-red-700">*</span></label>
          <input id="trade-in-credit-amount" className={`${fieldClass} max-w-xs`} type="text" inputMode="decimal" required placeholder="0.00" aria-describedby="trade-in-credit-amount-help" value={amount} onChange={(event) => { setAmount(event.target.value); clearSelection(); }} />
          <p id="trade-in-credit-amount-help" className="mt-2 text-xs text-stone-600">Enter the employee-determined store credit for accepting this item, in dollars and cents.</p>
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          {reviewed && <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-100 p-3 text-sm text-emerald-950" role="status">Form checked. The trade-in details are valid. This preview does not save trades or issue credit.</p>}
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-emerald-200 pt-5">
            <button className="rounded-md px-4 py-2.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2" type="button" onClick={resetForm}>Clear form</button>
            <button className={buttonClass} type="submit">Check trade in</button>
          </div>
        </form>
      </section>
    </main>
  );
}
