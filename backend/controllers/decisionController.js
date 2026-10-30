import Decision from '../models/Decision.js';
import Procurement from '../models/Procurement.js';
import Project from '../models/Project.js';
import Supplier from '../models/Supplier.js';
import { buildSupplierComparison } from '../services/scoringService.js';
import { analyzeProcurementDecision } from '../services/aiService.js';

export const evaluateDecision = async (req, res) => {
  try {
    const { requirementId } = req.body;
    const requirement = await Procurement.findById(requirementId).populate('project');

    if (!requirement) {
      return res.status(404).json({ message: 'Procurement requirement not found' });
    }

    const project = await Project.findById(requirement.project);
    const activeSuppliers = await Supplier.find({ status: 'Active' });
    const materialName = requirement.materialName.trim().toLowerCase();
    const suppliers = activeSuppliers.filter((supplier) =>
      supplier.materialsSupplied.some((material) => material.trim().toLowerCase() === materialName)
    );

    if (!suppliers.length) {
      return res.status(422).json({ message: `No active suppliers are available for ${requirement.materialName}.` });
    }

    const comparison = buildSupplierComparison({
      suppliers,
      requirement,
      project,
    });

    const payload = {
      project,
      requirement: requirement.toObject(),
      suppliers: suppliers.map((supplier) => supplier.toObject()),
      weightedScores: comparison[0] || {},
      budget: { max: requirement.maxBudget, projectBudget: project.budget },
      riskAnalysis: {
        riskLevels: suppliers.map((supplier) => supplier.riskLevel),
      },
    };

    const aiResult = await analyzeProcurementDecision(payload);

    const recommendedSupplier = await Supplier.findOne({ supplierName: aiResult.recommendation });
    const alternativeSupplier = await Supplier.findOne({ supplierName: aiResult.alternativeSupplier || '' });

    const decision = await Decision.create({
      project: project._id,
      requirement: requirement._id,
      recommendedSupplier: recommendedSupplier?._id || suppliers[0]?._id,
      alternativeSupplier: alternativeSupplier?._id || suppliers[1]?._id || null,
      confidenceScore: aiResult.confidence || 0,
      overallScore: aiResult.weightedScores?.overall || comparison[0]?.overallScore || 0,
      summary: aiResult.summary || '',
      reasons: aiResult.reasons || [],
      risks: aiResult.risks || [],
      suggestedAction: aiResult.suggestedAction || '',
      costInsight: aiResult.costInsight || '',
      deliveryInsight: aiResult.deliveryInsight || '',
      qualityInsight: aiResult.qualityInsight || '',
      status: 'Approved',
      weightedScores: aiResult.weightedScores || {},
      scoredSuppliers: comparison,
    });

    res.status(201).json({
      decision,
      comparison,
      aiResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error generating procurement decision' });
  }
};

export const getDecisions = async (req, res) => {
  const decisions = await Decision.find().populate('project').populate('requirement').populate('recommendedSupplier');
  res.json(decisions);
};
