import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: String,
  salary: String,
  url: String,
  source: String, // LinkedIn, Indeed, etc.
  description: String,
  matchScore: Number,
  status: {
    type: String,
    enum: ['saved', 'applied', 'interviewing', 'offer', 'rejected'],
    default: 'saved',
  },
  appliedDate: Date,
  hrContact: {
    name: String,
    email: String,
    linkedin: String,
  },
}, { timestamps: true });

export const Job = (mongoose.models.Job as mongoose.Model<any>) || mongoose.model('Job', jobSchema);
