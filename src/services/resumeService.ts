import { GoogleGenAI } from "@google/genai";
import jsPDF from "jspdf";

/**
 * Service to analyze job descriptions and auto-tailor resume bullet points using Gemini.
 * It also handles the generation of the PDF.
 */
export class ResumeService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Analyzes the job description and rewrites the user's resume bullet points to match keywords.
   */
  async tailorResume(userProfile: any, jobDescription: string) {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) optimizer.
      Analyze the following Job Description:
      "${jobDescription}"
      
      Now look at the candidate's current profile:
      Name: ${userProfile.name}
      Summary: ${userProfile.summary || ''}
      Skills/Experience: ${userProfile.skills?.join(', ') || ''}
      
      Your task is to:
      1. Rewrite the professional summary to perfectly align with the core requirements of the job.
      2. Generate 4-5 highly impactful bullet points that showcase the candidate's skills using the exact keywords from the job description.
      
      Return ONLY a valid JSON object matching this structure:
      {
        "tailoredSummary": "string",
        "tailoredBullets": ["string", "string"]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      return data;
    } catch (error) {
      console.error("Failed to tailor resume:", error);
      throw new Error("Resume tailoring failed");
    }
  }

  /**
   * Generates a beautifully formatted PDF using jsPDF.
   */
  generatePDF(profile: any, tailoredData: { tailoredSummary: string, tailoredBullets: string[] }) {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    
    // Header
    doc.setFontSize(22);
    doc.text(profile.name || "Candidate Name", 20, 30);
    doc.setFontSize(12);
    doc.text(profile.title || "Professional", 20, 40);
    doc.text(`${profile.location || 'Remote'} | ${profile.email || 'email@example.com'}`, 20, 48);
    
    // Summary
    doc.setFontSize(14);
    doc.text("Professional Summary", 20, 65);
    doc.setFontSize(11);
    const summary = tailoredData.tailoredSummary || profile.summary || "Experienced professional.";
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, 75);
    
    let y = 75 + (splitSummary.length * 6) + 10;
    
    // Experience & Skills
    doc.setFontSize(14);
    doc.text("Experience & Skills", 20, y);
    y += 10;
    
    doc.setFontSize(11);
    const bullets = tailoredData.tailoredBullets || profile.skills || [];
    bullets.forEach((bullet: string) => {
      const splitBullet = doc.splitTextToSize(`• ${bullet}`, 170);
      doc.text(splitBullet, 20, y);
      y += (splitBullet.length * 6);
    });
    
    // Save
    doc.save(`Tailored_Resume_${profile.name?.replace(/ /g, '_') || 'Candidate'}.pdf`);
  }
}

export async function parseResumeFile(file: File): Promise<Partial<any>> {
  if (file.type !== 'application/pdf') {
    throw new Error('Please upload a PDF file');
  }

  return new Promise((resolve) => {
    // In a real application, you would use pdf.js to extract text from the PDF
    // and then use an LLM or NLP to parse the text into a structured profile.
    
    // For this prototype, we'll simulate the extraction process with a mock delay
    setTimeout(() => {
      resolve({
        name: file.name.split('.')[0].replace(/[-_]/g, ' '),
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA (Extracted)',
        summary: 'Experienced software engineer extracted from resume. Passionate about building scalable applications and leading high-performing teams.',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'System Design']
      });
    }, 1500);
  });
}
