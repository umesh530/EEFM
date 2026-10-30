import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Supplier from '../models/Supplier.js';
import Material from '../models/Material.js';
import Procurement from '../models/Procurement.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (!userCount) {
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const admin = await User.create({
        name: 'System Admin',
        email: 'admin@procureai.com',
        password: adminPassword,
        role: 'admin',
      });

      const managerPassword = await bcrypt.hash('Manager@123', 10);
      await User.create({
        name: 'Procurement Manager',
        email: 'manager@procureai.com',
        password: managerPassword,
        role: 'procurement_manager',
      });

      console.log('Seeded demo users:', admin.email);
    }

    const projectCount = await Project.countDocuments();
    if (!projectCount) {
      const projects = await Project.insertMany([
        {
          projectName: 'Bridge Construction Project',
          projectCode: 'BRG-101',
          description: 'Expansion of a major highway bridge structure and access road network.',
          projectType: 'Infrastructure',
          startDate: '2026-01-10',
          endDate: '2026-12-20',
          budget: 2500000,
          projectManager: 'A. Mehta',
          status: 'Procurement',
        },
        {
          projectName: 'Industrial Plant Expansion',
          projectCode: 'IND-204',
          description: 'Mechanical and electrical equipment expansion for the process line.',
          projectType: 'Industrial',
          startDate: '2026-02-05',
          endDate: '2026-11-25',
          budget: 1800000,
          projectManager: 'K. Shah',
          status: 'Active',
        },
        {
          projectName: 'Solar Power Plant',
          projectCode: 'SOL-305',
          description: 'Grid-connected solar energy supply and distribution equipment procurement.',
          projectType: 'Energy',
          startDate: '2026-03-02',
          endDate: '2026-10-30',
          budget: 4200000,
          projectManager: 'M. Nair',
          status: 'Planning',
        },
        {
          projectName: 'Manufacturing Facility',
          projectCode: 'MFG-411',
          description: 'New assembly plant to support production capacity uplift.',
          projectType: 'Manufacturing',
          startDate: '2026-04-12',
          endDate: '2026-09-18',
          budget: 3600000,
          projectManager: 'V. Patel',
          status: 'Active',
        },
        {
          projectName: 'Highway Construction Project',
          projectCode: 'HWY-505',
          description: 'Multi-lane highway development with drainage and pavement works.',
          projectType: 'Roads',
          startDate: '2026-01-18',
          endDate: '2027-02-10',
          budget: 5100000,
          projectManager: 'R. Singh',
          status: 'Procurement',
        },
      ]);
      console.log('Seeded projects:', projects.length);
    }

    const supplierCount = await Supplier.countDocuments();
    if (!supplierCount) {
      const suppliers = await Supplier.insertMany([
        { supplierName: 'ABC Steel Pvt. Ltd.', supplierCode: 'SUP-001', contactPerson: 'Amit Kumar', email: 'amit@abcsteel.com', phone: '9876543210', location: 'Mumbai', materialsSupplied: ['Structural Steel', 'Rebar'], averagePrice: 68000, qualityScore: 91, deliveryScore: 94, reliabilityScore: 89, previousOrders: 48, successfulOrders: 42, onTimeDelivery: 96, defectRate: 1.4, riskLevel: 'Low', certifications: ['ISO 9001', 'IS 2062'], status: 'Active' },
        { supplierName: 'Lalit Cement Co.', supplierCode: 'SUP-002', contactPerson: 'Lalit Verma', email: 'lalit@lalitcement.com', phone: '9812345678', location: 'Delhi', materialsSupplied: ['Cement', 'Concrete'], averagePrice: 4200, qualityScore: 88, deliveryScore: 87, reliabilityScore: 82, previousOrders: 52, successfulOrders: 46, onTimeDelivery: 91, defectRate: 2.1, riskLevel: 'Low', certifications: ['ISO 9001'], status: 'Active' },
        { supplierName: 'Powertron Equipment', supplierCode: 'SUP-003', contactPerson: 'Neel Shah', email: 'neel@powertron.com', phone: '9898765432', location: 'Ahmedabad', materialsSupplied: ['Industrial Motors', 'Electrical Panels'], averagePrice: 155000, qualityScore: 90, deliveryScore: 88, reliabilityScore: 86, previousOrders: 35, successfulOrders: 31, onTimeDelivery: 89, defectRate: 2.5, riskLevel: 'Medium', certifications: ['ISO 14001'], status: 'Active' },
        { supplierName: 'Metro Cable Systems', supplierCode: 'SUP-004', contactPerson: 'Rhea Iyer', email: 'rhea@metrocables.com', phone: '9867123456', location: 'Hyderabad', materialsSupplied: ['Copper Cable', 'Power Cables'], averagePrice: 120000, qualityScore: 86, deliveryScore: 82, reliabilityScore: 79, previousOrders: 30, successfulOrders: 25, onTimeDelivery: 84, defectRate: 3.4, riskLevel: 'Medium', certifications: ['IEC 60228'], status: 'Active' },
        { supplierName: 'Prime Fasteners', supplierCode: 'SUP-005', contactPerson: 'Dinesh Rao', email: 'dinesh@primefasteners.com', phone: '9823456765', location: 'Bengaluru', materialsSupplied: ['Fasteners', 'Bolts'], averagePrice: 25000, qualityScore: 83, deliveryScore: 76, reliabilityScore: 72, previousOrders: 44, successfulOrders: 34, onTimeDelivery: 79, defectRate: 3.9, riskLevel: 'Medium', certifications: ['ISO 9001'], status: 'Under Review' },
        { supplierName: 'SolarGrid Solutions', supplierCode: 'SUP-006', contactPerson: 'Samira Khan', email: 'samira@solargrid.com', phone: '9988776655', location: 'Pune', materialsSupplied: ['Solar Panels', 'Inverters'], averagePrice: 980000, qualityScore: 94, deliveryScore: 90, reliabilityScore: 90, previousOrders: 22, successfulOrders: 19, onTimeDelivery: 92, defectRate: 1.8, riskLevel: 'Low', certifications: ['IEC 61215', 'UL Listed'], status: 'Active' },
        { supplierName: 'Delta Pipe Works', supplierCode: 'SUP-007', contactPerson: 'Ashok Jain', email: 'ashok@deltapipe.com', phone: '9912345678', location: 'Jaipur', materialsSupplied: ['Pipes', 'Valves'], averagePrice: 90000, qualityScore: 81, deliveryScore: 75, reliabilityScore: 70, previousOrders: 26, successfulOrders: 18, onTimeDelivery: 74, defectRate: 4.8, riskLevel: 'High', certifications: ['ASTM'], status: 'Active' },
        { supplierName: 'Zenith Bearings', supplierCode: 'SUP-008', contactPerson: 'Pooja Menon', email: 'pooja@zenithbearings.com', phone: '9933445566', location: 'Chennai', materialsSupplied: ['Bearings', 'Gears'], averagePrice: 78000, qualityScore: 92, deliveryScore: 93, reliabilityScore: 91, previousOrders: 41, successfulOrders: 38, onTimeDelivery: 95, defectRate: 1.6, riskLevel: 'Low', certifications: ['ISO 9001', 'DIN Certified'], status: 'Active' },
        { supplierName: 'Vanguard Electricals', supplierCode: 'SUP-009', contactPerson: 'Ravi Khatri', email: 'ravi@vanguardelec.com', phone: '9876123456', location: 'Nagpur', materialsSupplied: ['Electrical Panels', 'Switchgear'], averagePrice: 203000, qualityScore: 85, deliveryScore: 80, reliabilityScore: 78, previousOrders: 29, successfulOrders: 24, onTimeDelivery: 82, defectRate: 3.6, riskLevel: 'Medium', certifications: ['IS 8623'], status: 'Active' },
        { supplierName: 'Apex Concrete Ltd.', supplierCode: 'SUP-010', contactPerson: 'Nitin Desai', email: 'nitin@apexconcrete.com', phone: '9877001122', location: 'Vadodara', materialsSupplied: ['Concrete', 'Aggregate'], averagePrice: 5000, qualityScore: 87, deliveryScore: 89, reliabilityScore: 84, previousOrders: 39, successfulOrders: 34, onTimeDelivery: 90, defectRate: 2.4, riskLevel: 'Low', certifications: ['IS 456'], status: 'Active' },
      ]);
      console.log('Seeded suppliers:', suppliers.length);
    }

    const materialCount = await Material.countDocuments();
    if (!materialCount) {
      const materials = await Material.insertMany([
        { materialName: 'Structural Steel', category: 'Metals', description: 'High-strength structural steel for building frame and bridge members.', specification: 'IS 2062 Grade E250', unit: 'kg', averageMarketPrice: 70, minimumOrderQuantity: 1000, preferredSuppliers: ['ABC Steel Pvt. Ltd.'], criticality: 'High' },
        { materialName: 'Cement', category: 'Construction', description: 'OPC cement for concrete works and foundations.', specification: 'IS 269 OPC 43 Grade', unit: 'bag', averageMarketPrice: 420, minimumOrderQuantity: 50, preferredSuppliers: ['Lalit Cement Co.'], criticality: 'High' },
        { materialName: 'Copper Cable', category: 'Electrical', description: 'Power distribution cable for substation and plant uses.', specification: 'IEC 60228', unit: 'm', averageMarketPrice: 210, minimumOrderQuantity: 1000, preferredSuppliers: ['Metro Cable Systems'], criticality: 'High' },
        { materialName: 'Electrical Panels', category: 'Electrical', description: 'Low-voltage switchboard panels for industrial operations.', specification: 'IEC 61439', unit: 'nos', averageMarketPrice: 25000, minimumOrderQuantity: 10, preferredSuppliers: ['Vanguard Electricals', 'Powertron Equipment'], criticality: 'High' },
        { materialName: 'Bearings', category: 'Mechanical', description: 'Industrial bearings for rotating equipment support.', specification: 'DIN 625', unit: 'nos', averageMarketPrice: 1500, minimumOrderQuantity: 20, preferredSuppliers: ['Zenith Bearings'], criticality: 'Medium' },
        { materialName: 'Concrete', category: 'Construction', description: 'Ready-mix concrete for foundations and slabs.', specification: 'M30 Grade', unit: 'm3', averageMarketPrice: 5800, minimumOrderQuantity: 10, preferredSuppliers: ['Apex Concrete Ltd.'], criticality: 'High' },
        { materialName: 'Industrial Motors', category: 'Mechanical', description: 'Three-phase motors for process machinery.', specification: 'IE2 Efficiency', unit: 'nos', averageMarketPrice: 90000, minimumOrderQuantity: 5, preferredSuppliers: ['Powertron Equipment'], criticality: 'High' },
        { materialName: 'Solar Panels', category: 'Energy', description: 'Photovoltaic panel modules for renewable power generation.', specification: 'IEC 61215', unit: 'nos', averageMarketPrice: 18000, minimumOrderQuantity: 50, preferredSuppliers: ['SolarGrid Solutions'], criticality: 'Medium' },
        { materialName: 'Pipes', category: 'Infrastructure', description: 'Pressure-rated pipeline segments for utility installation.', specification: 'ASTM A53', unit: 'm', averageMarketPrice: 1150, minimumOrderQuantity: 300, preferredSuppliers: ['Delta Pipe Works'], criticality: 'Medium' },
        { materialName: 'Fasteners', category: 'Mechanical', description: 'Structural bolts and fasteners for assembly work.', specification: 'IS 1367', unit: 'box', averageMarketPrice: 2600, minimumOrderQuantity: 20, preferredSuppliers: ['Prime Fasteners'], criticality: 'Medium' },
        { materialName: 'Reinforcement Steel', category: 'Metals', description: 'TMT reinforcement bars for structural concrete.', specification: 'Fe 500D', unit: 'kg', averageMarketPrice: 78, minimumOrderQuantity: 1500, preferredSuppliers: ['ABC Steel Pvt. Ltd.'], criticality: 'High' },
        { materialName: 'Aggregate', category: 'Construction', description: 'Coarse and fine aggregate for concrete mixing.', specification: 'IS 383', unit: 'ton', averageMarketPrice: 1500, minimumOrderQuantity: 8, preferredSuppliers: ['Apex Concrete Ltd.'], criticality: 'Low' },
        { materialName: 'Valves', category: 'Infrastructure', description: 'Industrial valves for process control and fluid transfer.', specification: 'API 600', unit: 'nos', averageMarketPrice: 9500, minimumOrderQuantity: 15, preferredSuppliers: ['Delta Pipe Works'], criticality: 'Medium' },
        { materialName: 'Switchgear', category: 'Electrical', description: 'Circuit protection and power distribution switchgear.', specification: 'IEC 62271', unit: 'nos', averageMarketPrice: 42000, minimumOrderQuantity: 8, preferredSuppliers: ['Vanguard Electricals'], criticality: 'High' },
        { materialName: 'Inverters', category: 'Energy', description: 'Power conversion systems for solar power plants.', specification: 'IEC 62109', unit: 'nos', averageMarketPrice: 68000, minimumOrderQuantity: 10, preferredSuppliers: ['SolarGrid Solutions'], criticality: 'High' },
      ]);
      console.log('Seeded materials:', materials.length);
    }

    const procurementCount = await Procurement.countDocuments();
    if (!procurementCount) {
      const adminUser = await User.findOne({ role: 'admin' });
      const projectList = await Project.find();
      const requirements = await Procurement.insertMany([
        {
          project: projectList[0]._id,
          materialName: 'Structural Steel',
          materialCategory: 'Metals',
          quantity: 5000,
          unit: 'kg',
          requiredQuality: 'IS 2062 Grade E250',
          requiredDeliveryDate: '2026-11-15',
          maxBudget: 400000,
          minSupplierRating: 80,
          criticality: 'High',
          technicalSpecifications: 'High strength structural members with mill test certificate.',
          additionalNotes: 'Priority is low defect rate and timely delivery.',
          createdBy: adminUser._id,
          status: 'Open',
        },
        {
          project: projectList[1]._id,
          materialName: 'Electrical Panels',
          materialCategory: 'Electrical',
          quantity: 18,
          unit: 'nos',
          requiredQuality: 'IEC 61439 compliant',
          requiredDeliveryDate: '2026-08-20',
          maxBudget: 650000,
          minSupplierRating: 82,
          criticality: 'High',
          technicalSpecifications: 'Panel boards with complete protection and testing.',
          additionalNotes: 'Plant shutdown risk is significant.',
          createdBy: adminUser._id,
          status: 'In Review',
        },
        {
          project: projectList[2]._id,
          materialName: 'Solar Panels',
          materialCategory: 'Energy',
          quantity: 140,
          unit: 'nos',
          requiredQuality: 'IEC 61215 approved',
          requiredDeliveryDate: '2026-09-10',
          maxBudget: 2600000,
          minSupplierRating: 85,
          criticality: 'Medium',
          technicalSpecifications: 'High-efficiency PV modules with warranty support.',
          additionalNotes: 'Inspection and certification required before dispatch.',
          createdBy: adminUser._id,
          status: 'Open',
        },
        {
          project: projectList[3]._id,
          materialName: 'Industrial Motors',
          materialCategory: 'Mechanical',
          quantity: 16,
          unit: 'nos',
          requiredQuality: 'IE2 Efficiency',
          requiredDeliveryDate: '2026-07-30',
          maxBudget: 1500000,
          minSupplierRating: 80,
          criticality: 'High',
          technicalSpecifications: 'Three-phase motors with site service support.',
          additionalNotes: 'Critical for equipment installation sequencing.',
          createdBy: adminUser._id,
          status: 'Approved',
        },
        {
          project: projectList[4]._id,
          materialName: 'Pipes',
          materialCategory: 'Infrastructure',
          quantity: 600,
          unit: 'm',
          requiredQuality: 'ASTM A53 Grade B',
          requiredDeliveryDate: '2026-10-12',
          maxBudget: 700000,
          minSupplierRating: 78,
          criticality: 'Medium',
          technicalSpecifications: 'Corrosion-resistant pipes with hydrostatic testing.',
          additionalNotes: 'Delivery schedule must align with roadwork sequencing.',
          createdBy: adminUser._id,
          status: 'Open',
        },
      ]);
      console.log('Seeded requirements:', requirements.length);
    }
  } catch (error) {
    console.error('Seed database error:', error.message);
  }
};

if (process.argv[1] && process.argv[1].toLowerCase().endsWith('seeddata.js')) {
  try {
    await seedDatabase();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Direct seed failed:', error.message);
    process.exitCode = 1;
  }
}

