export const analyzeRisk = (supplier) => {
  const defectRate = Number(supplier.defectRate || 0);
  const onTimeDelivery = Number(supplier.onTimeDelivery || 0);
  const reliability = Number(supplier.reliabilityScore || 0);
  const riskFactor =
    (supplier.riskLevel === 'High' ? 35 : supplier.riskLevel === 'Medium' ? 20 : 8) +
    defectRate * 0.7 +
    (100 - onTimeDelivery) * 0.4 +
    (100 - reliability) * 0.5;

  const normalized = Math.min(100, Math.max(0, riskFactor));

  return {
    score: Number(normalized.toFixed(1)),
    level: normalized >= 70 ? 'HIGH' : normalized >= 40 ? 'MEDIUM' : 'LOW',
    reasons: [
      `On-time delivery stands at ${onTimeDelivery}%`,
      `Defect rate is ${defectRate}%`,
      `Reliability score is ${reliability}/100`,
    ],
  };
};
