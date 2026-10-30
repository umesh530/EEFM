import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'procurement_manager', 'project_manager', 'viewer'],
      default: 'procurement_manager',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
