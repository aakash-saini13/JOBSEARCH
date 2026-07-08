import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
  }],
  preferredRoles: [String],
  preferredLocations: [String],
  minSalary: Number,
  resumeData: {
    type: Object, // Structured parsed resume data
    default: {},
  },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
