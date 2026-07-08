import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Mail, Settings, Edit3, Send, CheckCircle2, User, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function Automations() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Email Outreach & AI Automation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your automated follow-ups, AI cover letters, and email campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 col-span-2">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Currently running automated email sequences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Senior Dev Roles - SF', status: 'Running', sent: 45, replied: 12, rate: '26%' },
                { name: 'AI Startups Remote', status: 'Paused', sent: 120, replied: 34, rate: '28%' },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-zinc-800 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{campaign.name}</h4>
                      <Badge variant={campaign.status === 'Running' ? 'default' : 'secondary'} className={campaign.status === 'Running' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex gap-4">
                      <span>Sent: {campaign.sent}</span>
                      <span>Replies: {campaign.replied}</span>
                      <span className="text-green-600 font-medium">Reply Rate: {campaign.rate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Generate Artifacts</CardTitle>
            <CardDescription>Use AI to craft tailored documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-3" variant="outline">
              <FileText size={18} className="text-blue-500" />
              Tailor Resume for Job
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Edit3 size={18} className="text-purple-500" />
              Write Cover Letter
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Mail size={18} className="text-orange-500" />
              Draft Cold Email to HR
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <RefreshCw size={18} className="text-green-500" />
              Schedule 7-Day Follow-up
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 flex-1">
        <CardHeader>
          <CardTitle>AI Email Generator</CardTitle>
          <CardDescription>Generate hyper-personalized emails based on the company and hiring manager.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draft">
            <TabsList className="mb-4">
              <TabsTrigger value="draft">Draft New Email</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">SMTP Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="draft" className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4 border-r border-gray-100 dark:border-zinc-800 pr-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. OpenAI" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">HR / Manager Name (Optional)</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Sam Altman" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tone</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>Professional & Direct</option>
                        <option>Enthusiastic & Passionate</option>
                        <option>Short & Impactful</option>
                      </select>
                    </div>
                    <Button className="w-full gap-2"><Sparkles size={16} /> Generate with AI</Button>
                 </div>
                 <div className="pl-2 flex flex-col">
                    <label className="text-sm font-medium mb-2">Generated Output</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 resize-none" 
                      placeholder="AI generated email will appear here..."
                      readOnly
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Copy</Button>
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"><Send size={16} /> Send Email</Button>
                    </div>
                 </div>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
