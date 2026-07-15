import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, DollarSign, Filter, Sparkles, Building, Briefcase, ChevronDown, Loader2, Mail, ShieldAlert, Bot } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  source: string;
  posted: string;
  description?: string;
  requirements?: string[];
  analysis?: string;
  isFakeJob?: boolean;
  scamAnalysis?: string;
}

export default function JobSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');
  const [filterWorkMode, setFilterWorkMode] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  
  const [searchResults, setSearchResults] = useState<JobMatch[]>([
    { id: '1', title: 'Senior AI Engineer', company: 'DeepMind', location: 'London, UK (Hybrid)', salary: '$180k - $220k', match: 98, source: 'LinkedIn', posted: '2h ago', analysis: "Your experience with Large Language Models aligns well.", description: "DeepMind is looking for an AI Engineer to train foundation models.", requirements: ["5+ years Python", "PyTorch expertise"] },
    { id: '2', title: 'Machine Learning Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200k - $250k', match: 95, source: 'Company Career Page', posted: '5h ago', analysis: "Matches your deep learning skillset.", description: "Join OpenAI's core modeling team.", requirements: ["CUDA", "Distributed Systems"] },
    { id: '3', title: 'Data Entry / Software Tester', company: 'Unknown Corp', location: 'Remote', salary: '$160k - $190k', match: 89, source: 'Wellfound', posted: '1d ago', analysis: "Your React and AI background is perfect.", description: "Very easy job but high pay.", requirements: ["React", "TypeScript", "Node.js"], isFakeJob: true, scamAnalysis: "Salary is disproportionate to role. Unknown Corp has no verifiable footprint." },
  ]);

  const { applyForJob, applications, profile, addApplication } = useUser();
  const { toast } = useToast();


  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);

  const handleSearch = async () => {
    if (!query) {
      toast('Please enter a search query', 'error');
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location, filterSalary, filterWorkMode, filterExperience, profile })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.jobs || []);
      } else {
        toast('Failed to search jobs', 'error');
      }
    } catch (e) {
      console.error(e);
      toast('Failed to search jobs', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const [isAutoApplying, setIsAutoApplying] = useState(false);
    const autoApplyAll = async () => {
    if (!searchResults.length) return;
    setIsAutoApplying(true);
    let successCount = 0;
    let linkedInCount = 0;
    let emailCount = 0;
    toast('Starting smart auto-apply (Bot Mode)...', 'success');
    
    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      if (!cachedAccessToken) {
        toast('Please login with Google to use auto-apply', 'error');
        setIsAutoApplying(false);
        return;
      }
      
      for (const job of searchResults) {
        if (job.isFakeJob) { 
           console.log("Skipping fake job: " + job.title);
           continue;
        }
        
        const isLinkedIn = !!(job.source && job.source.toLowerCase().includes('linkedin'));
      let hrPhone: string | null = null;
        
        if (isLinkedIn) {
          await fetch('/api/ai/run-linkedin-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName: job.company, applicantName: profile.name, applicantTitle: profile.title })
          });
          linkedInCount++;
          
          await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
            body: JSON.stringify({
              to: profile.email,
              subject: `LinkedIn Application Confirmation: ${job.title} at ${job.company}`,
              message: `Hello ${profile.name},<br><br>You have successfully applied to ${job.title} at ${job.company} through LinkedIn.<br><br>---<br>This email is system generated and the system is generated by Aakash Saini.`
            })
          });
        } else {
          const aiResponse = await fetch('/api/ai/auto-fetch-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobContext: `Job Title: ${job.title}, Company: ${job.company}`,
              userProfile: profile
            })
          });
          const aiData = await aiResponse.json();
          const hrEmail = aiData?.hrEmail || `hr@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          const atsResume = aiData?.atsResume || "No resume generated.";
          
          const doc = new jsPDF();
          doc.setFontSize(22);
          doc.text(profile.name || "Candidate Name", 20, 30);
          doc.setFontSize(12);
          doc.text(profile.email || "email@example.com", 20, 40);
          const splitText = doc.splitTextToSize(atsResume, 170);
          doc.text(splitText, 20, 50);
          const pdfBase64 = doc.output('datauristring').split(',')[1];
          const pdfName = `Resume_${profile.name?.replace(/ /g, '_') || 'Candidate'}.pdf`;

          const emailContent = `Hi ${aiData?.managerName || 'Hiring Manager'},<br><br>I am very interested in the ${job.title} position at ${job.company}.<br><br>Please find my ATS-friendly resume attached.<br><br>Best regards,<br>${profile.name}`;

          await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
            body: JSON.stringify({
              to: hrEmail,
              subject: `Application: ${job.title} - ${profile.name}`,
              message: emailContent,
              attachmentBase64: pdfBase64,
              attachmentName: pdfName
            })
          });
          
          await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
            body: JSON.stringify({
              to: profile.email,
              subject: `Job Application Confirmation: ${job.title} at ${job.company}`,
              message: `Hello ${profile.name},<br><br>You have successfully applied to ${job.title} at ${job.company} via email. We sent your resume to ${hrEmail}.<br><br>---<br>This email is system generated and the system is generated by Aakash Saini.`
            })
          });
          emailCount++;
        }
        
        await addApplication({
          id: Math.random().toString(36).substr(2, 9),
          role: job.title,
          company: job.company,
          location: job.location,
          status: 'applied',
          applied: new Date().toISOString().split('T')[0],
          outreachAttempted: true,
          outreachType: 'email',
          nextStep: 'Waiting for response',
          source: job.source
        });
        successCount++;
      }
      
      toast(`Successfully applied to ${successCount} jobs! (${linkedInCount} via LinkedIn bot, ${emailCount} via Email)`, 'success');
    } catch (err) {
      console.error(err);
      toast('Auto-apply failed. Please try again.', 'error');
    } finally {
      setIsAutoApplying(false);
    }
  };

  const executeSingleApply = async (job: JobMatch) => {
    setIsApplying(true);
    setShowApplyDialog(false);
    toast('Starting smart apply...', 'success');
    
    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      if (!cachedAccessToken) {
        toast('Please login with Google to use auto-apply', 'error');
        setIsApplying(false);
        return;
      }
      let hrPhone: string | null = null;
      
      const isLinkedIn = !!(job.source && job.source.toLowerCase().includes('linkedin'));

      if (isLinkedIn) {
        await fetch('/api/ai/run-linkedin-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: job.company, applicantName: profile.name, applicantTitle: profile.title })
        });
        
        await fetch('/api/gmail/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
          body: JSON.stringify({
            to: profile.email,
            subject: `LinkedIn Application Confirmation: ${job.title} at ${job.company}`,
            message: `Hello ${profile.name},<br><br>You have successfully applied to ${job.title} at ${job.company} through LinkedIn.<br><br>---<br>This email is system generated and the system is generated by Aakash Saini.`
          })
        });
      } else {
        const aiResponse = await fetch('/api/ai/auto-fetch-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobContext: `Job Title: ${job.title}, Company: ${job.company}`,
            userProfile: profile
          })
        });
        const aiData = await aiResponse.json();
        const hrEmail = aiData?.hrEmail || `hr@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        hrPhone = aiData?.hrPhone;
        const atsResume = aiData?.atsResume || "No resume generated.";
        
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(profile.name || "Candidate Name", 20, 30);
        doc.setFontSize(12);
        doc.text(profile.email || "email@example.com", 20, 40);
        const splitText = doc.splitTextToSize(atsResume, 170);
        doc.text(splitText, 20, 50);
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        const pdfName = `Resume_${profile.name?.replace(/ /g, '_') || 'Candidate'}.pdf`;

        if (hrPhone && hrPhone !== 'null') {
          const cleanPhone = hrPhone.replace(/\D/g, '');
          const waMessage = `${aiData?.whatsappDraft || 'Hi, I am interested in the role.'}\n\nHere is my ATS-friendly resume:\n\n${atsResume}`;
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`, '_blank');
        } else {
          const emailContent = `${aiData?.emailDraft?.replace(/\n/g, '<br>') || 'Hi, I am interested in this role.'}<br><br><strong>ATS-Friendly Resume:</strong><br><pre>${atsResume}</pre><br><br>---<br>This email is system generated and the system is generated by Aakash Saini.`;
          await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
            body: JSON.stringify({
              to: hrEmail,
              subject: `Application: ${job.title} - ${profile.name}`,
              message: emailContent,
              attachmentBase64: pdfBase64,
              attachmentName: pdfName
            })
          });
        }
        
        await fetch('/api/gmail/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cachedAccessToken}` },
          body: JSON.stringify({
            to: profile.email,
            subject: `Job Application Confirmation: ${job.title} at ${job.company}`,
            message: `Hello ${profile.name},<br><br>You have successfully applied to ${job.title} at ${job.company} via email. We sent your resume to ${hrEmail}.<br><br>---<br>This email is system generated and the system is generated by Aakash Saini.`
          })
        });
      }

      await addApplication({
        id: Math.random().toString(36).substr(2, 9),
        role: job.title,
        company: job.company,
        location: job.location,
        status: 'applied',
        applied: new Date().toISOString().split('T')[0],
        outreachAttempted: true,
        outreachType: (hrPhone && hrPhone !== 'null') ? 'whatsapp' : 'email',
        nextStep: 'Waiting for response',
        source: job.source
      });
      
      toast(`Successfully applied to ${job.company}!`, 'success');
    } catch (err) {
      console.error(err);
      toast('Application failed. Please try again.', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const [urlToExtract, setUrlToExtract] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<{companyName?: string, managerName?: string, hrEmail?: string, isFakeJob?: boolean, scamAnalysis?: string} | null>(null);

  const handleExtractFromUrl = async () => {
    if (!urlToExtract) return toast('Please enter a job link.', 'error');
    setIsExtracting(true);
    setExtractedData(null);
    try {
      const response = await fetch('/api/ai/auto-fetch-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobUrl: urlToExtract, userProfile: profile }),
      });
      if (!response.ok) throw new Error('Failed to extract');
      const data = await response.json();
      setExtractedData(data);
      
      if (data.isFakeJob) {
        toast('Warning: This looks like a ghost job or scam!', 'error');
        return; // Don't auto-add
      }

      if (data.companyName) {
        await addApplication({
          id: Math.random().toString(36).substr(2, 9),
          role: data.role || 'Unspecified Role',
          company: data.companyName,
          location: 'Remote',
          status: 'saved',
          applied: new Date().toISOString().split('T')[0],
          nextStep: 'Draft Follow-up Email',
          hrEmail: data.hrEmail,
          managerName: data.managerName
        });
        toast('Successfully extracted job details and saved to applications!', 'success');
      }
    } catch (error) {
      toast('Extraction failed', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <motion.div 
      className="h-full flex flex-col space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Smart Search & RPA Bot</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover, analyze (Ghost Job Detector), and auto-apply with Bot.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Job title, keywords, or company" 
            className="pl-10 bg-gray-50 dark:bg-zinc-950 border-transparent focus-visible:ring-purple-500 h-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="w-full md:w-64 relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="City, state, or Remote" 
            className="pl-10 bg-gray-50 dark:bg-zinc-950 border-transparent focus-visible:ring-purple-500 h-11"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 px-8 h-11" onClick={handleSearch} disabled={isSearching}>
          {isSearching ? <Loader2 className="animate-spin" /> : 'Search'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-1 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="text-purple-500" size={16} /> URL Quick Extract & Scam Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input 
                placeholder="Paste LinkedIn/Indeed URL" 
                className="text-sm"
                value={urlToExtract}
                onChange={(e) => setUrlToExtract(e.target.value)}
              />
              <Button onClick={handleExtractFromUrl} disabled={isExtracting} className="w-full gap-2">
                {isExtracting ? <Loader2 className="animate-spin" size={16} /> : 'Extract & Analyze'}
              </Button>
            </div>
            
            {extractedData && (
              <div className={`mt-4 p-4 rounded-md text-sm border space-y-2 ${extractedData.isFakeJob ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30' : 'bg-gray-50 border-gray-200 dark:bg-zinc-950 dark:border-zinc-800'}`}>
                {extractedData.isFakeJob && (
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium pb-2 border-b border-red-200 dark:border-red-800/30">
                    <ShieldAlert size={16} /> High Scam/Ghost Job Risk
                  </div>
                )}
                <p className="truncate"><span className="text-gray-500">Company:</span> {extractedData.companyName}</p>
                <p className="truncate"><span className="text-gray-500">Email:</span> <span className="font-medium text-blue-600">{extractedData.hrEmail}</span></p>
                {extractedData.scamAnalysis && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">{extractedData.scamAnalysis}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 flex flex-col min-h-0 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Matches & Analysis</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Showing {searchResults.length} results</span>
              <Button onClick={autoApplyAll} disabled={isAutoApplying || searchResults.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
                {isAutoApplying ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
                Run RPA Auto-Apply
              </Button>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto pb-4 pr-2">
            {isSearching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardContent className="p-5">
                    <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mt-4"></div>
                  </CardContent>
                </Card>
              ))
            ) : searchResults.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No jobs found. Try adjusting your search criteria.
              </div>
            ) : (
              searchResults.map((job, idx) => (

              <Card 
                key={job.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedJobIndex === idx ? 'ring-2 ring-purple-500 border-transparent' : 'border-gray-200 dark:border-zinc-800'} ${job.isFakeJob ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                onClick={() => setSelectedJobIndex(idx)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={job.match > 90 ? 'default' : 'secondary'} className={job.match > 90 ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {job.match}% Match
                    </Badge>
                    <span className="text-xs text-gray-500">{job.posted}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{job.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Building size={14} className="mr-1.5 shrink-0" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  
                  {job.isFakeJob && (
                    <div className="mb-4 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-md flex items-center gap-1.5">
                      <ShieldAlert size={14} /> Fake/Ghost Job Detected
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center"><MapPin size={14} className="mr-2" /> {job.location}</div>
                    <div className="flex items-center"><DollarSign size={14} className="mr-2" /> {job.salary}</div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>
      </div>
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply via RPA Bot</DialogTitle>
            <DialogDescription>
              Our background bot will automatically fill out forms and attach your tailored resume.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
              <Bot size={20} className="shrink-0" />
              <p className="text-sm">The bot will navigate to <strong>{selectedJob?.source}</strong> and submit your application.</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">A tailored email/resume will be generated and sent.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
            <Button disabled={isApplying} onClick={() => { if (selectedJob) executeSingleApply(selectedJob); }}>{isApplying ? <Loader2 className="animate-spin mr-2" size={16} /> : null}Start RPA Bot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
