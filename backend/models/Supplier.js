import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true },
    supplierCode: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    materialsSupplied: [{ type: String }],
    averagePrice: { type: Number, required: true },
    qualityScore: { type: Number, default: 0 },
    deliveryScore: { type: Number, default: 0 },
    reliabilityScore: { type: Number, default: 0 },
    previousOrders: { type: Number, default: 0 },
    successfulOrders: { type: Number, default: 0 },
    onTimeDelivery: { type: Number, default: 0 },
    defectRate: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    certifications: [{ type: String }],
    status: {
      type: String,
      enum: ['Active', 'Under Review', 'Blacklisted'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
