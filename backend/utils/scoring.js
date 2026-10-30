export const calculateWeightedScore = ({
  price,
  quality,
  delivery,
  reliability,
  risk,
  quantity,
  budget,
  requiredQualityScore,
}) => {
  const normalizedPrice = clamp(100 - (price / Math.max(1, budget / Math.max(1, quantity || 1))) * 100, 0, 100);
  const qualityScore = clamp((quality || 0) * 100, 0, 100);
  const deliveryScore = clamp((delivery || 0) * 100, 0, 100);
  const reliabilityScore = clamp((reliability || 0) * 100, 0, 100);
  const riskScore = clamp((100 - (risk || 0) * 100), 0, 100);

  const costScore = clamp((normalizedPrice + (requiredQualityScore || 0)) / 2, 0, 100);

  const overallScore =
    costScore * 0.25 +
    qualityScore * 0.25 +
    deliveryScore * 0.2 +
    reliabilityScore * 0.15 +
    riskScore * 0.15;

  return {
    costScore: Number(costScore.toFixed(1)),
    qualityScore: Number(qualityScore.toFixed(1)),
    deliveryScore: Number(deliveryScore.toFixed(1)),
    reliabilityScore: Number(reliabilityScore.toFixed(1)),
    riskScore: Number(riskScore.toFixed(1)),
    overallScore: Number(overallScore.toFixed(1)),
  };
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const classifyRisk = (score) => {
  if (score >= 70) return 'LOW';
  if (score >= 40) return 'MEDIUM';
  return 'HIGH';
};
