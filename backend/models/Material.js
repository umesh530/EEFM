import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    materialName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    specification: { type: String, default: '' },
    unit: { type: String, required: true },
    averageMarketPrice: { type: Number, required: true },
    minimumOrderQuantity: { type: Number, default: 1 },
    preferredSuppliers: [{ type: String }],
    criticality: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

const Material = mongoose.model('Material', materialSchema);
export default Material;
