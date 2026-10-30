import { analyzeProcurementDecision, generateChatResponse } from '../services/aiService.js';
import Project from '../models/Project.js';
import Procurement from '../models/Procurement.js';
import Supplier from '../models/Supplier.js';

export const analyzeDecision = async (req, res) => {
  try {
    const { requirementId } = req.body;
    const requirement = await Procurement.findById(requirementId).populate('project');
    const project = await Project.findById(requirement.project._id || requirement.project);
    const suppliers = await Supplier.find({ status: 'Active' });

    const payload = {
      project: project.toObject(),
      requirement: requirement.toObject(),
      suppliers: suppliers.map((supplier) => supplier.toObject()),
      weightedScores: {},
      budget: { max: requirement.maxBudget },
      riskAnalysis: {},
    };

    const result = await analyzeProcurementDecision(payload);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'AI analysis failed' });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { question, project, requirement, suppliers, history } = req.body;

    const answer = await generateChatResponse({
      question,
      project,
      requirement,
      suppliers,
      history,
    });

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message || 'AI chat failed' });
  }
};
