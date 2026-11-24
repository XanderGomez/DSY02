import { storeLocations, type StoreLocation } from './session';

export default function StoreSelection({ onSelect }: { onSelect: (store: StoreLocation) => void }) {
  return (
    <main className="px-4 pb-12 sm:px-6">
      <section className="mx-auto mt-8 max-w-3xl rounded-xl border border-emerald-200 bg-[#f3f8f1] p-5 shadow-sm sm:mt-12 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">Choose your store</h1>
        <p className="mt-2 text-sm text-stone-600">Select the location where you are working today.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {storeLocations.map((store) => (
            <button key={store.id} type="button" onClick={() => onSelect(store)} className="overflow-hidden rounded-lg border border-stone-300 bg-white text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
              <span aria-hidden="true" className={`block h-3 ${store.bannerClass}`} />
              <span className="block p-5">
                <span className="block text-base font-semibold text-emerald-950">{store.name}</span>
                <span className="mt-2 block text-sm text-stone-600">{store.address}</span>
                <span className="mt-1 block text-sm text-stone-600">{store.phone}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs text-stone-500">Your selection stays active when employees log out. You can change it from the login screen.</p>
      </section>
    </main>
  );
}
