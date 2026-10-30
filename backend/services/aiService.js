import OpenAI from 'openai';
import { calculateWeightedScore } from '../utils/scoring.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const getFallbackRecommendation = (payload) => {
  const scoredSuppliers = (payload.suppliers || []).map((supplier, index) => {
    const score = calculateWeightedScore({
      price: Number(supplier.averagePrice || 0),
      quality: Number(supplier.qualityScore || 0) / 100,
      delivery: Number(supplier.deliveryScore || 0) / 100,
      reliability: Number(supplier.reliabilityScore || 0) / 100,
      risk: supplier.riskLevel === 'Low' ? 0.1 : supplier.riskLevel === 'Medium' ? 0.35 : 0.6,
      quantity: Number(payload.requirement?.quantity || 1),
      budget: Number(payload.requirement?.maxBudget || payload.budget?.budget || 1000000),
      requiredQualityScore: 80,
    });

    return {
      supplier: supplier.supplierName,
      overallScore: score.overallScore,
      costScore: score.costScore,
      qualityScore: score.qualityScore,
      deliveryScore: score.deliveryScore,
      reliabilityScore: score.reliabilityScore,
      riskScore: score.riskScore,
    };
  });

  scoredSuppliers.sort((a, b) => b.overallScore - a.overallScore);
  const best = scoredSuppliers[0] || { supplier: 'No supplier available', overallScore: 0 };
  const alternative = scoredSuppliers[1] || { supplier: 'N/A', overallScore: 0 };

  return {
    recommendation: best.supplier,
    confidence: Math.min(96, Math.max(72, Math.round(best.overallScore))),
    summary: `${best.supplier} provides the strongest overall balance of cost, quality, delivery, reliability, and risk for this requirement.`,
    reasons: [
      `Overall score ${best.overallScore}/100 is the highest among available suppliers.`,
      `Quality score ${best.qualityScore}/100 is aligned to the project requirement.`,
      `Delivery and reliability scores indicate a lower disruption risk.`,
    ],
    risks: [
      'Price volatility may still affect final cost if market conditions change.',
      'Delivery risk should be monitored against the required date.',
    ],
    alternativeSupplier: alternative.supplier,
    costInsight: `Estimated procurement cost should remain within the budget envelope when using ${best.supplier}.`,
    deliveryInsight: `Delivery performance is favorable relative to the requirement deadline.`,
    qualityInsight: `Quality is within acceptable tolerance for the specified technical standard.`,
    suggestedAction: `Negotiate unit price and ensure delivery milestones are locked before purchase approval.`,
    weightedScores: {
      cost: best.costScore,
      quality: best.qualityScore,
      delivery: best.deliveryScore,
      reliability: best.reliabilityScore,
      risk: best.riskScore,
      overall: best.overallScore,
    },
  };
};

export const analyzeProcurementDecision = async (payload) => {
  if (!openai) {
    return getFallbackRecommendation(payload);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are ProcureAI, a procurement decision assistant. Use only the supplied application data. Do not invent supplier prices, ratings, certifications, or history. Explain recommendation using the deterministic weighted scores and structured data provided. Return valid JSON only.',
        },
        {
          role: 'user',
          content: JSON.stringify(payload),
        },
      ],
      temperature: 0.2,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      return getFallbackRecommendation(payload);
    }

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      weightedScores: parsed.weightedScores || payload.weightedScores || {},
    };
  } catch (error) {
    console.error('OpenAI analysis failed:', error.message);
    return getFallbackRecommendation(payload);
  }
};

export const generateProcurementSummary = async (payload) => {
  const summary = await analyzeProcurementDecision(payload);
  return summary.summary || 'Procurement decision generated using the structured scoring model.';
};

export const analyzeSupplierRisk = async (supplier) => {
  return {
    recommendation: supplier.riskLevel === 'Low' ? 'Stable supplier' : supplier.riskLevel === 'Medium' ? 'Monitor closely' : 'Escalate risk review',
    level: supplier.riskLevel || 'Medium',
    observedRisk: Number(((supplier.defectRate || 0) + (100 - (supplier.onTimeDelivery || 0))) / 2).toFixed(1),
  };
};

export const generateCostInsights = async (payload) => {
  const best = (payload.suppliers || []).sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0))[0];
  return {
    budget: payload.budget || 0,
    bestCostOption: best ? best.supplierName : 'No supplier',
    insight: best
      ? `The lowest-cost option is ${best.supplierName}, but the final choice should still account for quality and delivery performance.`
      : 'No valid supplier option is available.',
  };
};

export const generateChatResponse = async ({ question, project, requirement, suppliers, history }) => {
  const prompt = {
    question,
    project,
    requirement,
    suppliers,
    history,
  };

  if (!openai) {
    const lower = question.toLowerCase();
    const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
    const projectName = project?.projectName || 'your current project';
    const requirementName = requirement?.materialName || requirement?.projectName || 'the selected material';

    if (!safeSuppliers.length) {
      return "I don't have enough data to determine that yet. Add supplier data or open a project with active procurement requirements.";
    }

    const scoredSuppliers = safeSuppliers.map((supplier) => {
      const score = calculateWeightedScore({
        price: Number(supplier.averagePrice || 0),
        quality: Number(supplier.qualityScore || 0) / 100,
        delivery: Number(supplier.deliveryScore || 0) / 100,
        reliability: Number(supplier.reliabilityScore || 0) / 100,
        risk: supplier.riskLevel === 'Low' ? 0.1 : supplier.riskLevel === 'Medium' ? 0.35 : 0.6,
        quantity: Number(requirement?.quantity || 1),
        budget: Number(requirement?.maxBudget || 1000000),
        requiredQualityScore: Number(requirement?.minSupplierRating || 80),
      });

      return {
        ...supplier,
        overallScore: Number(score.overallScore || 0),
      };
    });

    scoredSuppliers.sort((a, b) => b.overallScore - a.overallScore);
    const topSupplier = scoredSuppliers[0];
    const lowestCostSupplier = [...safeSuppliers].sort((a, b) => Number(a.averagePrice || 0) - Number(b.averagePrice || 0))[0];
    const highRiskSupplier = safeSuppliers.find((supplier) => supplier.riskLevel === 'High') || safeSuppliers.find((supplier) => supplier.riskLevel === 'Medium');

    if (lower.includes('risk')) {
      return highRiskSupplier
        ? `${projectName} has a material-risk watch on ${highRiskSupplier.supplierName}. It is currently flagged as ${highRiskSupplier.riskLevel} risk because of lower delivery and reliability signals compared with the top-ranked suppliers.`
        : `${projectName} does not currently show a high-risk supplier based on the available supplier data.`;
    }

    if (lower.includes('cost') || lower.includes('price')) {
      return lowestCostSupplier
        ? `The lowest-cost option for ${requirementName} is ${lowestCostSupplier.supplierName} at about ₹${Number(lowestCostSupplier.averagePrice || 0).toLocaleString()} per unit. I would still compare it with quality and delivery scores before final approval.`
        : "I don't have enough data to determine the cost comparison yet.";
    }

    if (lower.includes('recommend') || lower.includes('choose') || lower.includes('best')) {
      return topSupplier
        ? `For ${projectName}, the strongest recommendation is ${topSupplier.supplierName}. It leads the weighted model with an overall score of ${topSupplier.overallScore.toFixed(1)}/100 based on cost, quality, delivery, reliability, and risk. The recommendation is aligned to ${requirementName}.`
        : "I don't have enough data to make a supplier recommendation yet.";
    }

    if (lower.includes('compare') || lower.includes('supplier')) {
      const topNames = scoredSuppliers.slice(0, 3).map((supplier) => `${supplier.supplierName} (${supplier.overallScore.toFixed(1)}/100)`).join(', ');
      return topSupplier
        ? `The current supplier comparison for ${projectName} ranks: ${topNames}. ${topSupplier.supplierName} is the strongest option for ${requirementName}, while delivery and risk should continue to be monitored for the rest.`
        : "I don't have enough data to compare suppliers yet.";
    }

    if (lower.includes('summary') || lower.includes('status')) {
      return topSupplier
        ? `${projectName} is currently trending with ${requirementName} procurement. ${topSupplier.supplierName} is the leading option, while ${highRiskSupplier ? highRiskSupplier.supplierName : 'the remaining suppliers'} should be reviewed for risk and delivery timing.`
        : "I don't have enough data to summarize the current procurement status yet.";
    }

    return `Based on the available data for ${projectName}, ${topSupplier ? `${topSupplier.supplierName} is the leading supplier for ${requirementName}` : 'the supplier ranking is still unclear'}. I recommend checking the latest quality, delivery, and risk metrics before final approval.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a procurement chatbot. Answer using the given application context only. If required data is absent, say: "I don\'t have enough data to determine that." Do not invent supplier information. Return concise but useful answers.',
        },
        { role: 'user', content: JSON.stringify(prompt) },
      ],
      temperature: 0.3,
    });

    return response.choices?.[0]?.message?.content || "I don't have enough data to determine that.";
  } catch (error) {
    return "I don't have enough data to determine that.";
  }
};
