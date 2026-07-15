import express from 'express';
import { GoogleGenAI, Type, Schema } from "@google/genai";

const router = express.Router();

router.post('/auto-fetch-email', async (req, res) => {
  try {
    const { jobUrl, jobContext, userProfile } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
      The user wants to apply to a job. Context: ${jobUrl || jobContext}
      
      Simulate a real-time extraction of the job posting. Extract or creatively generate realistic mock details for:
      1. Company Name
      2. Hiring Manager Name
      3. HR Email Address\n      4. HR Phone Number (if none, return null)
      
      Also, analyze this job URL and general context to detect if it's a "Ghost Job" or Scam.
      
      Then, write a professional job application cold email directed to this HR/Manager, using the user's profile:
      Name: ${userProfile?.name || 'A candidate'}
      Role: ${userProfile?.role || 'A professional'}
      Skills: ${userProfile?.skills?.join(', ') || ''}
      Summary: ${userProfile?.summary || ''}
      
      Return ONLY a valid JSON object:
      {
        "companyName": "string",
        "managerName": "string",
        "hrEmail": "string",
        "hrPhone": "string or null",
        "emailDraft": "string",
        "whatsappDraft": "string",
        "atsResume": "string (a tailored text-based ATS friendly resume based on the profile)",
        "isFakeJob": boolean,
        "scamAnalysis": "string explaining why it might be fake or real"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error) {
    console.error('Auto-fetch error:', error);
    res.status(500).json({ error: 'Failed to auto-fetch.' });
  }
});

router.post('/match-jobs', async (req, res) => {
  try {
    const { userProfile, query, location, filters } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
      Based on the following candidate profile and search preferences, generate a list of 5 realistic job postings.
      
      Search Preferences:
      Query: ${query || 'Any'}
      Location: ${location || 'Any'}
      Salary Filter: ${filters?.salary || 'Any'}
      
      Candidate Profile:
      Name: ${userProfile?.name || 'A candidate'}
      Skills: ${userProfile?.skills?.join(', ') || 'React, TypeScript'}
      
      Include a scam detector! For at least one job, simulate it as a "Ghost Job" (fake, always open, data harvesting) and mark isFakeJob: true.
      
      Format output as JSON:
      {
        "jobs": [
          {
            "id": "string",
            "title": "string",
            "company": "string",
            "location": "string",
            "salary": "string",
            "match": number (0-100),
            "source": "string",
            "posted": "string",
            "description": "string",
            "requirements": ["string"],
            "analysis": "string",
            "isFakeJob": boolean,
            "scamAnalysis": "string"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

import { ResumeService } from '../services/resumeService.js';

router.post('/tailor-resume', async (req, res) => {
  try {
    const { userProfile, jobDescription } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'API key missing' });
    
    const resumeService = new ResumeService(process.env.GEMINI_API_KEY);
    const result = await resumeService.tailorResume(userProfile, jobDescription);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { jobDescription, companyName, roleName, userProfile } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'No API key' });
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      Write a professional cover letter for ${roleName} at ${companyName}.
      Job Description: ${jobDescription}
      Candidate Profile: Name: ${userProfile?.name}, Skills: ${userProfile?.skills?.join(', ')}, Summary: ${userProfile?.summary}
      Keep it professional, no placeholders.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({ coverLetter: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-linkedin', async (req, res) => {
  try {
    const { companyName, hrName, userProfile } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'No API key' });
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      Write a short, engaging LinkedIn connection request message (under 300 characters) to ${hrName || 'the Hiring Manager'} at ${companyName}.
      My name is ${userProfile.name}, my role is ${userProfile.title}.
      I just applied for a role at their company and want to connect.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({ message: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


import { runLinkedInAutoConnect } from '../services/linkedinService.js';

router.post('/run-linkedin-bot', async (req, res) => {
  try {
    const { companyName, applicantName, applicantTitle } = req.body;
    
    // Fire and forget (background process)
    runLinkedInAutoConnect(companyName, applicantName, applicantTitle).catch(console.error);
    
    res.json({ message: 'LinkedIn automation bot started in the background.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-email', async (req, res) => {
  try {
    const { companyName, managerName, contactInfo, contactType, tone, userProfile, applicationStatus } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'No API key' });
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let prompt = '';
    if (contactType === 'phone') {
      prompt = `
        You are an expert career coach helping a candidate text a recruiter on WhatsApp.
        Draft a brief, professional, and friendly WhatsApp message to the Hiring Manager/Recruiter (${managerName || 'Recruiter'}) at ${companyName}.
        Context: ${applicationStatus}
        Candidate: ${userProfile?.name || 'A candidate'}, Role: ${userProfile?.title || 'Professional'}, Skills: ${userProfile?.skills?.join(', ') || ''}.
        Keep it concise, authentic, and with a "human touch", suitable for a WhatsApp text message.
      `;
    } else {
      prompt = `
        You are an expert career coach helping a candidate write a cold email.
        Draft a highly personalized, "human touch" cold email to the Hiring Manager/Recruiter (${managerName || 'Recruiter'}) at ${companyName}.
        Tone: ${tone || 'Professional & Direct'}
        Context: ${applicationStatus}
        Candidate: ${userProfile?.name || 'A candidate'}, Role: ${userProfile?.title || 'Professional'}, Skills: ${userProfile?.skills?.join(', ') || ''}.
        Ensure the email feels authentic, not like a generic template. Add a human touch to the message.
      `;
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    res.json({ email: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
