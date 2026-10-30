import { calculateWeightedScore, classifyRisk } from '../utils/scoring.js';

export const buildSupplierComparison = ({ suppliers = [], requirement = {}, project = {} }) => {
  const quantity = Number(requirement.quantity || 1);
  const budget = Number(requirement.maxBudget || project.budget || 1000000);

  return suppliers
    .map((supplier) => {
      const priceFactor = Number(supplier.averagePrice || 0);
      const qualityScore = Number(supplier.qualityScore || 0);
      const deliveryScore = Number(supplier.deliveryScore || 0);
      const reliabilityScore = Number(supplier.reliabilityScore || 0);
      const riskScore = supplier.riskLevel === 'Low' ? 90 : supplier.riskLevel === 'Medium' ? 65 : 35;
      const riskFactor = supplier.riskLevel === 'Low' ? 0.1 : supplier.riskLevel === 'Medium' ? 0.35 : 0.65;

      const weighted = calculateWeightedScore({
        price: priceFactor,
        quality: qualityScore / 100,
        delivery: deliveryScore / 100,
        reliability: reliabilityScore / 100,
        risk: riskFactor,
        quantity,
        budget,
        requiredQualityScore: Math.min(100, project.budget ? (qualityScore * 0.5 + 50) : 80),
      });

      return {
        supplierId: supplier._id || supplier.id,
        supplierName: supplier.supplierName,
        supplierCode: supplier.supplierCode,
        price: priceFactor,
        quality: Number(qualityScore.toFixed(1)),
        delivery: Number(deliveryScore.toFixed(1)),
        reliability: Number(reliabilityScore.toFixed(1)),
        risk: Number(riskScore.toFixed(1)),
        costScore: weighted.costScore,
        overallScore: weighted.overallScore,
        riskStatus: classifyRisk(riskScore),
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore);
};
