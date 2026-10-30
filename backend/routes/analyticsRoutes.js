import express from 'express';
import Project from '../models/Project.js';
import Supplier from '../models/Supplier.js';
import Procurement from '../models/Procurement.js';
import Decision from '../models/Decision.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find();
    const suppliers = await Supplier.find();
    const procurements = await Procurement.find();
    const decisions = await Decision.find();

    const totalProcurementValue = procurements.reduce((sum, item) => sum + (item.maxBudget || 0), 0);
    const averageOrderValue = procurements.length ? totalProcurementValue / procurements.length : 0;
    const bestSupplier = suppliers.sort((a, b) => (b.qualityScore + b.reliabilityScore) - (a.qualityScore + a.reliabilityScore))[0];
    const lowCostSupplier = suppliers.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0))[0];
    const highestQuality = suppliers.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))[0];
    const highRiskSuppliers = suppliers.filter((supplier) => supplier.riskLevel === 'High');
    const now = new Date();
    const monthlySpending = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      return {
        key,
        name: monthDate.toLocaleString('en', { month: 'short' }),
        value: 0,
      };
    });
    const monthlyTotals = new Map(monthlySpending.map((month) => [month.key, month]));

    procurements.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const month = monthlyTotals.get(key);
      if (month) month.value += Number(item.maxBudget || 0);
    });

    const analytics = {
      totalProjects: projects.length,
      totalSuppliers: suppliers.length,
      totalProcurementValue,
      averageOrderValue,
      bestSupplier: bestSupplier ? bestSupplier.supplierName : 'N/A',
      lowestCostSupplier: lowCostSupplier ? lowCostSupplier.supplierName : 'N/A',
      highestQualitySupplier: highestQuality ? highestQuality.supplierName : 'N/A',
      highRiskSuppliers: highRiskSuppliers.map((supplier) => supplier.supplierName),
      decisionsMade: decisions.length,
      riskDistribution: {
        low: suppliers.filter((supplier) => supplier.riskLevel === 'Low').length,
        medium: suppliers.filter((supplier) => supplier.riskLevel === 'Medium').length,
        high: suppliers.filter((supplier) => supplier.riskLevel === 'High').length,
      },
      monthlySpending: monthlySpending.map(({ key, ...month }) => month),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Analytics failed' });
  }
});

export default router;
