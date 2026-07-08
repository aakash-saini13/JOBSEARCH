import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle2, Circle, Clock, MoreHorizontal, ExternalLink, GripVertical, Building, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function Applications() {
  const applications = [
    { id: 1, company: 'Google', role: 'Staff Software Engineer', location: 'Mountain View, CA', status: 'interviewing', applied: '2025-05-12', nextStep: 'Onsite Interview - May 25' },
    { id: 2, company: 'Stripe', role: 'Frontend Engineer', location: 'Remote', status: 'applied', applied: '2025-05-18', nextStep: 'Waiting for response' },
    { id: 3, company: 'Meta', role: 'AI Engineer', location: 'Menlo Park, CA', status: 'rejected', applied: '2025-04-20', nextStep: 'None' },
    { id: 4, company: 'Anthropic', role: 'Software Engineer', location: 'San Francisco, CA', status: 'offer', applied: '2025-05-01', nextStep: 'Sign Offer by May 28' },
    { id: 5, company: 'OpenAI', role: 'Full Stack Developer', location: 'San Francisco, CA', status: 'saved', applied: 'N/A', nextStep: 'Apply by Friday' },
  ];

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
        <Button>Add Application</Button>
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
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
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
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-gray-400">
                            <MoreHorizontal size={14} />
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5"><Building size={14} /> {app.company}</div>
                          <div className="flex items-center gap-1.5"><MapPin size={14} /> {app.location}</div>
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
