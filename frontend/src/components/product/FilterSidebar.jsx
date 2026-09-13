import { useState } from 'react';

const gemstoneTypes = ['Ruby', 'Sapphire', 'Emerald', 'Diamond'];
const caratRanges = ['Under 1.00 ct', '1.00 - 2.00 ct', '2.00 - 5.00 ct', 'Over 5.00 ct'];
const cuts = ['Oval', 'Cushion', 'Round', 'Emerald', 'Pear'];

export default function FilterSidebar({ onFilterChange, onReset, initialFilters = {} }) {
  const [selectedTypes, setSelectedTypes] = useState(initialFilters.types || []);
  const [selectedCarats, setSelectedCarats] = useState(initialFilters.carats || []);
  const [selectedCut, setSelectedCut] = useState(initialFilters.cut || '');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || { min: '', max: '' });
  const [inStock, setInStock] = useState(Boolean(initialFilters.inStock));

  const handleTypeChange = (type) => {
    const newSelected = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newSelected);
    onFilterChange({ types: newSelected });
  };

  const handleCaratChange = (carat) => {
    const newSelected = selectedCarats.includes(carat)
      ? selectedCarats.filter((c) => c !== carat)
      : [...selectedCarats, carat];
    setSelectedCarats(newSelected);
    onFilterChange({ carats: newSelected });
  };

  const handleCutChange = (cut) => {
    setSelectedCut(cut);
    onFilterChange({ cut });
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedCarats([]);
    setSelectedCut('');
    setPriceRange({ min: '', max: '' });
    setInStock(false);
    onReset?.();
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 pr-8">
      <div className="sticky top-32 space-y-10">
        <div>
          <h3 className="font-label text-label-caps text-primary mb-4 tracking-widest border-b border-outline-variant/30 pb-2">GEMSTONE TYPE</h3>
          <div className="space-y-3">
            {gemstoneTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="form-checkbox h-4 w-4 text-primary-container border-outline-variant rounded-sm focus:ring-primary-container focus:ring-offset-background bg-transparent transition duration-200"
                />
                <span className="font-body text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-label text-label-caps text-primary mb-4 tracking-widest border-b border-outline-variant/30 pb-2">CARAT WEIGHT</h3>
          <div className="space-y-3">
            {caratRanges.map((carat) => (
              <label key={carat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCarats.includes(carat)}
                  onChange={() => handleCaratChange(carat)}
                  className="form-checkbox h-4 w-4 text-primary-container border-outline-variant rounded-sm focus:ring-primary-container focus:ring-offset-background bg-transparent transition duration-200"
                />
                <span className="font-body text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{carat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-label text-label-caps text-primary mb-4 tracking-widest border-b border-outline-variant/30 pb-2">CUT</h3>
          <div className="flex flex-wrap gap-2">
            {cuts.map((cut) => (
              <button
                key={cut}
                onClick={() => handleCutChange(cut)}
                className={`px-3 py-1 font-button text-button border rounded-sm transition-colors ${
                  selectedCut === cut
                    ? 'border-primary bg-primary-container text-on-primary'
                    : 'border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary bg-transparent'
                }`}
              >
                {cut}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-label text-label-caps text-primary mb-4 tracking-widest border-b border-outline-variant/30 pb-2">PRICE RANGE</h3>
          <div className="flex items-center gap-4">
            <div className="border-b border-primary-container w-full py-1">
              <span className="text-on-surface-variant text-sm mr-1">$</span>
              <input
                className="bg-transparent border-none p-0 w-16 text-primary focus:ring-0 text-sm"
                placeholder="Min"
                type="number"
                value={priceRange.min}
                onChange={(e) => { const next = { ...priceRange, min: e.target.value }; setPriceRange(next); onFilterChange({ priceRange: next }); }}
              />
            </div>
            <span className="text-outline">-</span>
            <div className="border-b border-primary-container w-full py-1">
              <span className="text-on-surface-variant text-sm mr-1">$</span>
              <input
                className="bg-transparent border-none p-0 w-20 text-primary focus:ring-0 text-sm"
                placeholder="Max"
                type="number"
                value={priceRange.max}
                onChange={(e) => { const next = { ...priceRange, max: e.target.value }; setPriceRange(next); onFilterChange({ priceRange: next }); }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-label text-label-caps text-primary mb-4 tracking-widest border-b border-outline-variant/30 pb-2">AVAILABILITY</h3>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={inStock} onChange={(event) => { setInStock(event.target.checked); onFilterChange({ inStock: event.target.checked }); }} className="form-checkbox h-4 w-4 text-primary-container border-outline-variant rounded-sm focus:ring-primary-container focus:ring-offset-background bg-transparent transition duration-200" />
            <span className="font-body text-body-md text-on-surface-variant group-hover:text-primary transition-colors">In stock only</span>
          </label>
        </div>

        <button type="button" onClick={handleReset} className="w-full border border-outline-variant/50 rounded-sm px-4 py-3 font-button text-button text-primary hover:bg-primary-container hover:text-on-primary transition-colors">
          Reset all filters
        </button>
      </div>
    </aside>
  );
}
