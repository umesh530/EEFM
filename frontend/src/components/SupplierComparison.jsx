const SupplierComparison = ({ suppliers = [] }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50 text-sm font-semibold text-slate-700">
          <tr>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Quality</th>
            <th className="px-4 py-3">Delivery</th>
            <th className="px-4 py-3">Reliability</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id || supplier.supplierCode} className="border-t border-slate-200">
              <td className="px-4 py-3 text-sm font-medium text-slate-800">{supplier.supplierName}</td>
              <td className="px-4 py-3 text-sm">₹{supplier.averagePrice?.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{supplier.qualityScore || 0}</td>
              <td className="px-4 py-3 text-sm">{supplier.deliveryScore || 0}</td>
              <td className="px-4 py-3 text-sm">{supplier.reliabilityScore || 0}</td>
              <td className="px-4 py-3 text-sm">{supplier.riskLevel || 'Medium'}</td>
              <td className="px-4 py-3 text-sm">{supplier.qualityScore || 0}</td>
              <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{supplier.overallScore || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierComparison;
