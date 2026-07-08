import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FileText, Sparkles, Download, Eye, FileSignature, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

export default function Resume() {
  const { profile } = useUser();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("Base Resume (Master)");

  const handleTailorResume = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResumeTitle("Tailored Resume - Google SWE");
      setIsGenerating(false);
      toast("Successfully generated tailored resume", "success");
    }, 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">AI Resume Builder</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create ATS-optimized resumes tailored for every job.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg">My Resumes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-primary/5 border-primary/20 text-primary">
                <FileText size={16} /> {resumeTitle}
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileSignature size={16} /> Stripe - Staff Engineer
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileSignature size={16} /> OpenAI - ML Engineer
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/10 dark:to-zinc-900 border border-purple-100 dark:border-purple-800/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Auto-Tailor Resume</h3>
                <p className="text-sm text-gray-500 mt-1">Paste a job link to generate a custom resume instantly.</p>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleTailorResume}
                disabled={isGenerating}
              >
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Tailor New Resume"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">{resumeTitle}</h2>
              <Badge variant="outline">ATS Score: 92%</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Eye size={14} /> Preview</Button>
              <Button size="sm" className="gap-2"><Download size={14} /> Export PDF</Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-zinc-950">
            {/* Resume Canvas Preview */}
            <div 
              className="max-w-[800px] mx-auto bg-white min-h-[1056px] shadow-sm rounded-sm p-12 text-black font-sans focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              contentEditable={true}
              suppressContentEditableWarning={true}
            >
              <header className="border-b-2 border-gray-800 pb-6 mb-6 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{profile.name}</h1>
                <p className="text-gray-600 text-sm flex justify-center gap-4">
                  <span>{profile.email}</span>
                  <span>•</span>
                  <span>{profile.location}</span>
                </p>
                <p className="text-gray-600 text-sm mt-1 flex justify-center gap-4">
                  <span>{profile.github.replace('https://', '')}</span>
                  <span>•</span>
                  <span>{profile.linkedin.replace('https://', '')}</span>
                </p>
              </header>

              <section className="mb-8">
                <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Professional Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {profile.summary}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Experience</h2>
                
                <div className="mb-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{profile.title}</h3>
                    <span className="text-sm font-medium text-gray-600">Jan 2022 - Present</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">TechCorp Inc. • Remote</div>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    <li>Architected and implemented a microservices transition using Go and Node.js, reducing system latency by 40%.</li>
                    <li>Integrated LLM capabilities into the core SaaS product using OpenAI APIs, increasing user retention by 25%.</li>
                    <li>Mentored 4 junior engineers and established CI/CD best practices using GitHub Actions.</li>
                  </ul>
                </div>


                <div className="mb-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">Software Engineer</h3>
                    <span className="text-sm font-medium text-gray-600">Mar 2019 - Dec 2021</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Innovate Solutions • New York, NY</div>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    <li>Developed responsive React frontends used by over 500,000 monthly active users.</li>
                    <li>Optimized database queries in PostgreSQL, improving dashboard load times from 5s to under 1s.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-900">Core Technologies:</span> {profile.skills.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Languages:</span> TypeScript, Python, Go, SQL
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Frameworks:</span> React, Next.js, Express, PyTorch
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
