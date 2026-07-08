import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/generate-cover-letter', async (req: AuthRequest, res) => {
  try {
    const { jobDescription, companyName, roleName } = req.body;
    
    // Lazy initialize Gemini so it fails gracefully if key is missing
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const userProfile = {
      name: req.user.name,
      skills: req.user.skills,
      experience: req.user.experience
    };

    const prompt = `
      Write a professional cover letter for the role of ${roleName} at ${companyName}.
      
      Job Description:
      ${jobDescription}
      
      My Profile:
      Name: ${userProfile.name}
      Skills: ${userProfile.skills?.join(', ')}
      Experience: ${JSON.stringify(userProfile.experience)}
      
      Keep it concise, professional, and impactful. Do not include placeholder brackets like [Your Address].
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ coverLetter: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
