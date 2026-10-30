import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  materialName: '',
  category: 'Steel',
  description: '',
  specification: '',
  unit: 'kg',
  averageMarketPrice: '',
  minimumOrderQuantity: '',
  preferredSuppliers: '',
  criticality: 'Medium',
};

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchMaterials = async () => {
    const response = await api.get('/materials');
    setMaterials(response.data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/materials', {
      ...form,
      averageMarketPrice: Number(form.averageMarketPrice),
      minimumOrderQuantity: Number(form.minimumOrderQuantity),
      preferredSuppliers: form.preferredSuppliers.split(',').map((item) => item.trim()),
    });
    setForm(initialForm);
    fetchMaterials();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">materials</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Material Catalogue</h1>
        </div>
        <button className="btn-primary">Create Material</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Catalogue</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {materials.map((material) => (
              <div key={material._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{material.materialName}</h4>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-700">{material.criticality}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{material.description}</p>
                <div className="mt-3 text-sm text-slate-600">
                  <p>Category: {material.category}</p>
                  <p>Specification: {material.specification}</p>
                  <p>Unit: {material.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h3 className="text-lg font-semibold text-slate-900">Add Material</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label>Material Name</label>
              <input name="materialName" value={form.materialName} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Specification</label>
              <input name="specification" value={form.specification} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input min-h-[90px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Unit</label>
                <input name="unit" value={form.unit} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Avg. Market Price</label>
                <input type="number" name="averageMarketPrice" value={form.averageMarketPrice} onChange={handleChange} className="input" />
              </div>
            </div>
            <div>
              <label>Minimum Order Quantity</label>
              <input type="number" name="minimumOrderQuantity" value={form.minimumOrderQuantity} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Preferred Suppliers</label>
              <input name="preferredSuppliers" value={form.preferredSuppliers} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Criticality</label>
              <select name="criticality" value={form.criticality} onChange={handleChange} className="input">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Save Material</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Materials;
