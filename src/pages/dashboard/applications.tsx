import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button, buttonVariants } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { CheckCircle2, Circle, Clock, MoreHorizontal, ExternalLink, GripVertical, Building, MapPin, Mail, DollarSign, Briefcase } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useUser, Application } from '../../context/UserContext';
import { useNavigate } from 'react-router';

export default function Applications() {
  const { applications, addApplication, updateApplication, deleteApplication } = useUser();
  const navigate = useNavigate();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Partial<Application> | null>(null);

  const [newApp, setNewApp] = useState<Partial<Application>>({
    role: '',
    company: '',
    location: '',
    status: 'applied',
    applied: new Date().toISOString().split('T')[0],
    nextStep: 'Waiting for response'
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.role || !newApp.company) return;
    
    await addApplication({
      id: Math.random().toString(36).substr(2, 9),
      role: newApp.role,
      company: newApp.company,
      location: newApp.location || 'Remote',
      status: newApp.status as Application['status'],
      applied: newApp.applied || new Date().toISOString().split('T')[0],
      nextStep: newApp.nextStep || 'Waiting for response',
    });
    
    setIsAddOpen(false);
    setNewApp({
      role: '',
      company: '',
      location: '',
      status: 'applied',
      applied: new Date().toISOString().split('T')[0],
      nextStep: 'Waiting for response'
    });
  };

  const openDetails = (app: Application) => {
    setSelectedApp(app);
    setIsDetailsOpen(true);
  };

  const handleSaveDetails = async () => {
    if (selectedApp && selectedApp.id) {
      await updateApplication(selectedApp.id, selectedApp);
      setIsDetailsOpen(false);
    }
  };

  const handleDelete = async (appId: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(appId);
    }
  };

  const columns = [
    { id: 'saved', label: 'Saved', color: 'border-gray-200' },
    { id: 'applied', label: 'Applied', color: 'border-blue-200' },
    { id: 'interviewing', label: 'Interviewing', color: 'border-orange-200' },
    { id: 'offer', label: 'Offer', color: 'border-green-200' },
    { id: 'rejected', label: 'Rejected', color: 'border-red-200' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Job Pipeline</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your job applications across all stages.</p>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)}>Add Application</Button>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Application</DialogTitle>
              <DialogDescription>Track a new job opportunity.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <Input required value={newApp.role} onChange={e => setNewApp({...newApp, role: e.target.value})} placeholder="e.g. Frontend Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company *</label>
                <Input required value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})} placeholder="e.g. San Francisco, CA or Remote" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newApp.status} 
                    onChange={e => setNewApp({...newApp, status: e.target.value as Application['status']})}
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Applied</label>
                  <Input type="date" value={newApp.applied} onChange={e => setNewApp({...newApp, applied: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Save Application</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>Update info, add notes, and save job description.</DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={selectedApp.role || ''} onChange={e => setSelectedApp({...selectedApp, role: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input value={selectedApp.company || ''} onChange={e => setSelectedApp({...selectedApp, company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedApp.status} 
                      onChange={e => setSelectedApp({...selectedApp, status: e.target.value as Application['status']})}
                    >
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="follow-up sent">Follow-up Sent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Salary</Label>
                    <Input placeholder="e.g. $120k" value={selectedApp.salary || ''} onChange={e => setSelectedApp({...selectedApp, salary: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Job URL</Label>
                  <Input placeholder="https://" value={selectedApp.url || ''} onChange={e => setSelectedApp({...selectedApp, url: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <Label>Interview Notes / Tasks</Label>
                  <Textarea className="min-h-[100px]" placeholder="Add your notes here..." value={selectedApp.notes || ''} onChange={e => setSelectedApp({...selectedApp, notes: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea className="min-h-[150px]" placeholder="Paste job description..." value={selectedApp.description || ''} onChange={e => setSelectedApp({...selectedApp, description: e.target.value})} />
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveDetails}>Save Changes</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start max-w-fit">
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="flex-1 mt-4">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 h-full">
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>View all your saved and applied jobs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Next Step</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{app.company}</div>
                        <div className="text-sm text-gray-500">{app.role} • {app.location}</div>
                        {app.outreachAttempted && (
                          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 w-fit px-1.5 py-0.5 rounded-sm">
                            <CheckCircle2 size={10} /> Outreach: {app.outreachType === "whatsapp" ? "WhatsApp" : "Email"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          app.status === 'offer' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.status === 'interviewing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{app.applied}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{app.nextStep}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                            <MoreHorizontal size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/emails?company=${encodeURIComponent(app.company)}&status=${encodeURIComponent(app.status)}`)}>
                              <Mail size={14} className="mr-2" /> Draft Follow-up
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDetails(app)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(app.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="flex-1 mt-4 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max h-full">
            {columns.map(col => (
              <div key={col.id} className="w-80 flex flex-col bg-gray-100/50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-800">
                <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${col.color}`}>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">{col.label}</h3>
                  <Badge variant="secondary" className="bg-white dark:bg-zinc-800">
                    {applications.filter(a => a.status === col.id).length}
                  </Badge>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto min-h-[200px]">
                  {applications.filter(a => a.status === col.id).map(app => (
                    <Card key={app.id} className="cursor-grab active:cursor-grabbing border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{app.role}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-6 w-6 -mr-2 -mt-2 text-gray-400" })}>
                              <MoreHorizontal size={14} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/emails?company=${encodeURIComponent(app.company)}&status=${encodeURIComponent(app.status)}`)}>
                                <Mail size={14} className="mr-2" /> Draft Follow-up
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDetails(app)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(app.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5"><Building size={14} /> {app.company}</div>
                          <div className="flex items-center gap-1.5"><MapPin size={14} /> {app.location}</div>
                          {app.salary && <div className="flex items-center gap-1.5"><DollarSign size={14} /> {app.salary}</div>}
                          {app.outreachAttempted && (
                            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                              <CheckCircle2 size={14} /> 
                              Outreach: {app.outreachType === "whatsapp" ? "WhatsApp" : "Email"}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" /> 
                          {app.nextStep}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {applications.filter(a => a.status === col.id).length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg text-gray-400 text-sm py-8">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
