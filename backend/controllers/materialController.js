import Material from '../models/Material.js';

export const getMaterials = async (req, res) => {
  const materials = await Material.find().sort({ createdAt: -1 });
  res.json(materials);
};

export const createMaterial = async (req, res) => {
  const material = await Material.create(req.body);
  res.status(201).json(material);
};
