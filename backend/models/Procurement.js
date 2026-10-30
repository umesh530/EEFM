import mongoose from 'mongoose';

const procurementSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    materialName: { type: String, required: true },
    materialCategory: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    requiredQuality: { type: String, default: '' },
    requiredDeliveryDate: { type: Date, required: true },
    maxBudget: { type: Number, required: true },
    minSupplierRating: { type: Number, default: 0 },
    criticality: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    technicalSpecifications: { type: String, default: '' },
    additionalNotes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'In Review', 'Approved', 'Completed'], default: 'Open' },
  },
  { timestamps: true }
);

const Procurement = mongoose.model('Procurement', procurementSchema);
export default Procurement;
