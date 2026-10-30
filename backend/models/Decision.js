import mongoose from 'mongoose';

const decisionSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    requirement: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement', required: true },
    recommendedSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    alternativeSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    confidenceScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    reasons: [{ type: String }],
    risks: [{ type: String }],
    suggestedAction: { type: String, default: '' },
    costInsight: { type: String, default: '' },
    deliveryInsight: { type: String, default: '' },
    qualityInsight: { type: String, default: '' },
    status: { type: String, enum: ['Draft', 'Approved', 'Rejected'], default: 'Draft' },
    weightedScores: { type: Object, default: {} },
    scoredSuppliers: [{ type: Object }],
  },
  { timestamps: true }
);

const Decision = mongoose.model('Decision', decisionSchema);
export default Decision;
