import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FileText, Sparkles, Download, Eye, FileSignature, Loader2, X, FileEdit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import jsPDF from 'jspdf';

export default function Resume() {
  const { profile } = useUser();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("Base Resume (Master)");
  
  const [showTailorDialog, setShowTailorDialog] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredData, setTailoredData] = useState<{tailoredSummary?: string, tailoredBullets?: string[]}>({});
  
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState({ company: '', role: '', jd: '' });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");

  const handleTailorResume = async () => {
    if (!jobDescription) return toast('Please enter a job description', 'error');
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: profile, jobDescription })
      });
      const data = await res.json();
      setTailoredData(data);
      setResumeTitle("Tailored Resume");
      toast("Successfully tailored resume!", "success");
      setShowTailorDialog(false);
    } catch (e) {
      toast("Failed to tailor resume", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!coverLetterData.company || !coverLetterData.role) return toast('Missing company or role', 'error');
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription: coverLetterData.jd, 
          companyName: coverLetterData.company, 
          roleName: coverLetterData.role, 
          userProfile: profile 
        })
      });
      const data = await res.json();
      setGeneratedCoverLetter(data.coverLetter);
      toast("Cover Letter Generated!", "success");
    } catch (e) {
      toast("Failed to generate cover letter", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = (type: 'resume' | 'cover-letter') => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    
    if (type === 'resume') {
      doc.setFontSize(22);
      doc.text(profile.name || "Candidate Name", 20, 30);
      doc.setFontSize(12);
      doc.text(profile.title || "Professional", 20, 40);
      doc.text(`${profile.location || 'Remote'} | ${profile.email}`, 20, 48);
      
      doc.setFontSize(14);
      doc.text("Professional Summary", 20, 65);
      doc.setFontSize(11);
      const summary = tailoredData.tailoredSummary || profile.summary || "Experienced professional.";
      const splitSummary = doc.splitTextToSize(summary, 170);
      doc.text(splitSummary, 20, 75);
      
      let y = 75 + (splitSummary.length * 6) + 10;
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
      
      doc.save(`Resume_${profile.name?.replace(/ /g, '_') || 'Candidate'}.pdf`);
    } else {
      doc.setFontSize(12);
      doc.text(profile.name || "Candidate Name", 20, 30);
      doc.text(profile.email || "email@example.com", 20, 37);
      
      doc.text(new Date().toLocaleDateString(), 20, 50);
      doc.text(`Hiring Manager`, 20, 60);
      doc.text(`${coverLetterData.company}`, 20, 67);
      
      const splitBody = doc.splitTextToSize(generatedCoverLetter, 170);
      doc.text(splitBody, 20, 85);
      
      doc.save(`Cover_Letter_${coverLetterData.company.replace(/ /g, '_')}.pdf`);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Auto-Tailored Resume & Cover Letter Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI-powered generation tailored to specific Job Descriptions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Generators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 flex flex-col">
              <Button variant="outline" className="justify-start" onClick={() => setShowTailorDialog(true)}>
                <FileEdit size={16} className="mr-2 text-blue-500" /> Auto-Tailor Resume
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setShowCoverLetterDialog(true)}>
                <FileSignature size={16} className="mr-2 text-purple-500" /> Build Cover Letter
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg">My Resumes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-md text-purple-600 dark:text-purple-400">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{resumeTitle}</p>
                    <p className="text-xs text-gray-500">Updated just now</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col min-h-0 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Resume Preview</h3>
              {tailoredData.tailoredSummary && (
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">AI Tailored</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-2" onClick={() => generatePDF('resume')}>
                <Download size={14} /> Export PDF
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50 dark:bg-zinc-950/50">
            <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-sm p-10 min-h-[800px]">
              {/* Resume Content */}
              <div className="text-center border-b border-gray-200 dark:border-zinc-800 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{profile.name || 'Your Name'}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{profile.title || 'Professional Title'}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>{profile.location || 'Location'}</span>
                  <span>•</span>
                  <span>{profile.email || 'email@example.com'}</span>
                  {profile.phone && (
                    <><span>•</span><span>{profile.phone}</span></>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-800 pb-2 mb-3">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {tailoredData.tailoredSummary || profile.summary || 'A passionate professional looking for new opportunities. Update your profile or use the AI Tailor tool to customize this section for a specific job.'}
                  </p>
                </section>
                
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-zinc-800 pb-2 mb-3">
                    Skills & Expertise
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {(tailoredData.tailoredBullets || profile.skills || ['JavaScript', 'React']).map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showTailorDialog} onOpenChange={setShowTailorDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Auto-Tailor Resume</DialogTitle>
            <DialogDescription>Paste the job description and AI will optimize your summary and skills.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Job Description</Label>
            <Textarea 
              placeholder="Paste the requirements or JD here..." 
              className="h-40"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTailorDialog(false)}>Cancel</Button>
            <Button onClick={handleTailorResume} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
              Generate Custom Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCoverLetterDialog} onOpenChange={setShowCoverLetterDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Automated Cover Letter Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={coverLetterData.company} onChange={e => setCoverLetterData({...coverLetterData, company: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input value={coverLetterData.role} onChange={e => setCoverLetterData({...coverLetterData, role: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Description (Optional)</Label>
              <Textarea value={coverLetterData.jd} onChange={e => setCoverLetterData({...coverLetterData, jd: e.target.value})} />
            </div>
            
            <Button className="w-full" onClick={handleGenerateCoverLetter} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
              Generate Cover Letter
            </Button>

            {generatedCoverLetter && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <h3 className="font-semibold">Generated Output</h3>
                <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded border text-sm whitespace-pre-wrap">
                  {generatedCoverLetter}
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={() => generatePDF('cover-letter')}>
                  <Download size={16} /> Download Cover Letter (PDF)
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
