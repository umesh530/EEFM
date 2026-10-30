import Procurement from '../models/Procurement.js';

export const getProcurements = async (req, res) => {
  const procurements = await Procurement.find().populate('project').sort({ createdAt: -1 });
  res.json(procurements);
};

export const createProcurement = async (req, res) => {
  const procurement = await Procurement.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(procurement);
};
