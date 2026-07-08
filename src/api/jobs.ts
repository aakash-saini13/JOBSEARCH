import express from 'express';
import { Job } from '../models/Job.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.use(requireAuth);

// Get all jobs for the current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const jobs = await (Job as any).find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new job manually
router.post('/', async (req: AuthRequest, res) => {
  try {
    const job = new (Job as any)({
      ...req.body,
      userId: req.user._id
    });
    await job.save();
    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job status
router.patch('/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const job = await (Job as any).findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
