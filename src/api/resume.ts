import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
       res.status(400).json({ error: 'No file uploaded' });
       return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const fileBuffer = req.file.buffer;
    let text = '';

    if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      const parser = new PDFParse({ data: fileBuffer });
      const pdfResult = await parser.getText();
      await parser.destroy();
      text = pdfResult.text || '';
    } else {
      text = fileBuffer.toString('utf-8'); // Naive fallback
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
      Extract the following information from the resume text provided below.
      Format the output strictly as JSON that adheres to the provided schema.
      
      Resume Text:
      ${text.substring(0, 10000)} // Truncate to avoid massive context
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING, description: "Phone number of the candidate" },
            title: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "email", "phone", "title", "location", "linkedin", "github", "summary", "skills"]
        }
      }
    });

    const responseText = response.text || '{}';
    const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Resume Parse Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
