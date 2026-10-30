import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectCode: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    projectType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    projectManager: { type: String, required: true },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Procurement', 'Completed', 'On Hold'],
      default: 'Planning',
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
