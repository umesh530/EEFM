import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  supplierName: '',
  supplierCode: '',
  contactPerson: '',
  email: '',
  phone: '',
  location: '',
  materialsSupplied: '',
  averagePrice: '',
  qualityScore: 85,
  deliveryScore: 85,
  reliabilityScore: 80,
  onTimeDelivery: 90,
  defectRate: 2,
  riskLevel: 'Medium',
  certifications: 'ISO 9001',
  status: 'Active',
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchSuppliers = async () => {
    const response = await api.get('/suppliers');
    setSuppliers(response.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/suppliers', {
      ...form,
      materialsSupplied: form.materialsSupplied.split(',').map((item) => item.trim()),
      certifications: form.certifications.split(',').map((item) => item.trim()),
      averagePrice: Number(form.averagePrice),
      qualityScore: Number(form.qualityScore),
      deliveryScore: Number(form.deliveryScore),
      reliabilityScore: Number(form.reliabilityScore),
      onTimeDelivery: Number(form.onTimeDelivery),
      defectRate: Number(form.defectRate),
    });
    setForm(initialForm);
    fetchSuppliers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">suppliers</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Supplier Management</h1>
        </div>
        <button className="btn-primary">Add Supplier</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="card overflow-hidden">
          <h3 className="text-lg font-semibold text-slate-900">Supplier Database</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Quality</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-800">{supplier.supplierName}</td>
                    <td className="px-4 py-3">{supplier.location}</td>
                    <td className="px-4 py-3">{supplier.qualityScore}</td>
                    <td className="px-4 py-3">{supplier.riskLevel}</td>
                    <td className="px-4 py-3">{supplier.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h3 className="text-lg font-semibold text-slate-900">New Supplier</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label>Supplier Name</label>
              <input name="supplierName" value={form.supplierName} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Supplier Code</label>
              <input name="supplierCode" value={form.supplierCode} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Contact Person</label>
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Materials Supplied</label>
              <input name="materialsSupplied" value={form.materialsSupplied} onChange={handleChange} className="input" placeholder="Steel, Cement" />
            </div>
            <div>
              <label>Average Price</label>
              <input name="averagePrice" type="number" value={form.averagePrice} onChange={handleChange} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Quality Score</label>
                <input type="number" name="qualityScore" value={form.qualityScore} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Delivery Score</label>
                <input type="number" name="deliveryScore" value={form.deliveryScore} onChange={handleChange} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Reliability</label>
                <input type="number" name="reliabilityScore" value={form.reliabilityScore} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>On-Time %</label>
                <input type="number" name="onTimeDelivery" value={form.onTimeDelivery} onChange={handleChange} className="input" />
              </div>
            </div>
            <div>
              <label>Defect Rate %</label>
              <input type="number" name="defectRate" value={form.defectRate} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Risk Level</label>
              <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="input">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Save Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Suppliers;
