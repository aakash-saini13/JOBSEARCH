import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button, buttonVariants } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Mail, Linkedin, MoreVertical, Edit2, Trash2, Bot, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../context/ToastContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useUser } from '../../context/UserContext';

export default function Networking() {
  const { toast } = useToast();
  const { profile } = useUser();
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sarah Jenkins', role: 'Engineering Manager', company: 'TechCorp', metAt: 'React Summit 2023', lastContact: '2 weeks ago', status: 'Warm' },
    { id: 2, name: 'David Chen', role: 'Senior Recruiter', company: 'OpenAI', metAt: 'LinkedIn Outreach', lastContact: '1 month ago', status: 'Cold' },
    { id: 3, name: 'Emily Rodriguez', role: 'CTO', company: 'StartupX', metAt: 'Mutual Connection', lastContact: '3 days ago', status: 'Hot' },
  ]);

  const [search, setSearch] = useState('');
  
  const [showLinkedinDialog, setShowLinkedinDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleOutreach = (name: string) => {
    toast(`Drafting outreach email to ${name}...`, 'success');
  };

  const openLinkedinBot = (contact: any) => {
    setSelectedContact(contact);
    setGeneratedMessage('');
    setShowLinkedinDialog(true);
  };

  const generateLinkedinMessage = async () => {
    if (!selectedContact) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: selectedContact.company, hrName: selectedContact.name, userProfile: profile }),
      });
      const data = await response.json();
      setGeneratedMessage(data.message);
      toast('LinkedIn connection request drafted!', 'success');
    } catch (e) {
      toast('Failed to generate message.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const autoSendLinkedin = () => {
    if (!generatedMessage) return toast('Generate a message first', 'error');
    toast(`RPA Bot: Sent LinkedIn connection request to ${selectedContact.name} in background.`, 'success');
    setShowLinkedinDialog(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Networking & Auto-Connect</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage contacts and automate LinkedIn outreach via Bot.</p>
        </div>
        <Button className="gap-2"><Plus size={16} /> Add Contact</Button>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>My Network</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search contacts..." 
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{contact.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role} at {contact.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>Met at: <span className="font-medium text-gray-700 dark:text-gray-300">{contact.metAt}</span></span>
                      <span>•</span>
                      <span>Last contact: {contact.lastContact}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:w-auto w-full justify-between sm:justify-end">
                  <Badge variant="secondary" className={
                    contact.status === 'Hot' ? 'bg-orange-100 text-orange-800' :
                    contact.status === 'Warm' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }>
                    {contact.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openLinkedinBot(contact)}>
                      <Linkedin size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50" onClick={() => handleOutreach(contact.name)}>
                      <Mail size={14} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
                        <MoreVertical size={14} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Edit2 size={14} /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600"><Trash2 size={14} /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No contacts found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLinkedinDialog} onOpenChange={setShowLinkedinDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>LinkedIn Auto-Connect</DialogTitle>
            <DialogDescription>
              Our background bot will automatically search for {selectedContact?.name} on LinkedIn and send a personalized connection request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={generateLinkedinMessage} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Bot className="mr-2" size={16} />}
              Generate Personalized Request
            </Button>

            {generatedMessage && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-950 rounded border text-sm">
                {generatedMessage}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkedinDialog(false)}>Cancel</Button>
            <Button onClick={autoSendLinkedin} disabled={!generatedMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
              Send Connection Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
