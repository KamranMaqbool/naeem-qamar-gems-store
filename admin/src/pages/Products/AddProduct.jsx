import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: '', label: 'Select a category' },
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    regularPrice: '',
    salePrice: '',
    sku: '',
    quantity: 0,
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving product:', { ...formData, images });
    alert('Product saved successfully!');
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-background text-on-background antialiased flex">
      {/* SideNavBar */}
      <nav className="bg-primary h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md z-20">
        <div className="flex flex-col h-full py-6 text-on-primary">
          <div className="px-6 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center">
              <img className="w-8 h-8 rounded-full object-cover" alt="Virtuoso's Gems Logo" src="https://lh3.googleusercontent.com/aida/AEtjO1XzAdhEuIdFJgXwotFmo3tJTKpzl61CRZ_lDl60VAa9LuRJYZsaex62-vEwHTahLDR04mkULjvfQS0riGJlzqxY0qqPejCEQWgJ47HGkB8vCiTebshbA9xts34gjcQGi99u8Tq7kzlXjC_oVl2ots-dGIDfyWNVtLR6jHuwD4g6APi7Inc8G2xntqB0MpNohJYvrKGE10aMG1-tZIhIyrXktq90tCwzhIL8-JT3ckq_n7vgHIp13JHV4rVo" />
            </div>
            <div>
              <div className="text-[20px] leading-[28px] font-bold tracking-tight">VIRTUOSO'S GEMS</div>
              <div className="text-on-primary/70 text-[12px] leading-[16px] font-semibold uppercase tracking-wider">Luxury Admin</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/orders">
              <span className="material-symbols-outlined">shopping_cart</span>
              Orders
            </a>
            <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container/10 text-secondary-fixed border-l-4 border-secondary-fixed cursor-pointer active:scale-95" href="/products">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save_as</span>
              Products
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/inventory">
              <span className="material-symbols-outlined">inventory_2</span>
              Inventory
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/discounts">
              <span className="material-symbols-outlined">sell</span>
              Discounts
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:text-on-primary hover:bg-primary-container/50 transition-colors cursor-pointer active:scale-95" href="/settings">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest fixed top-0 right-0 left-64 h-16 border-b border-surface-container-highest shadow-sm z-10 flex justify-between items-center px-6 transition-all duration-200">
          <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-highest rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface w-64 placeholder:text-on-surface-variant" placeholder="Search..." type="text" />
            </div>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Basic Info Card */}
                <div className="card p-6">
                  <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">Product Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Product Title</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface placeholder:text-outline"
                        placeholder="Enter product name (e.g., Emerald Cut Diamond Ring)"
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface placeholder:text-outline"
                        placeholder="Detailed product description..."
                        rows={5}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="card p-6">
                  <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Regular Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                        <input
                          name="regularPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.regularPrice}
                          onChange={handleChange}
                          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Discount/Sale Price (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                        <input
                          name="salePrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.salePrice}
                          onChange={handleChange}
                          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Media Card */}
                <div className="card p-6">
                  <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">Media</h2>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      dragActive ? 'bg-primary-container/10 border-primary-container' : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className={`material-symbols-outlined text-4xl mb-2 transition-colors ${dragActive ? 'text-primary' : 'text-on-surface-variant'}`}>cloud_upload</span>
                      <p className="text-[14px] leading-[20px] text-on-surface-variant">Drag and drop images here</p>
                      <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-outline mt-1">or click to browse</p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-error/90 text-white flex items-center justify-center hover:bg-error transition-colors"
                            aria-label="Remove image"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inventory Card */}
                <div className="card p-6">
                  <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">Inventory & Stock</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SKU (Stock Keeping Unit)</label>
                      <input
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface font-mono text-[13px] leading-[18px] font-medium"
                        placeholder="e.g. LUX-RG-001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Current Quantity</label>
                      <input
                        name="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 text-on-surface"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-outline-variant flex justify-end gap-4">
              <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 border border-outline-variant rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
                Cancel
              </button>
              <button type="submit" form="product-form" className="px-4 py-2 bg-primary-container text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-resting flex items-center gap-2">
                Save Product
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}