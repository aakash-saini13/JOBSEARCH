import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Briefcase, CheckCircle, Mail, MapPin, Building, Star, ExternalLink, Calendar, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../../context/UserContext';

export default function Dashboard() {
  const { profile, applications, emails, contacts } = useUser();

  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const pendingEmailsCount = emails.filter(e => e.status === 'pending' || e.status === 'draft').length;
  const hotContactsCount = contacts.filter(c => c.status === 'Hot').length;

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending Emails', value: pendingEmailsCount, icon: Mail, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Hot Contacts (Events)', value: hotContactsCount, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Interviews Scheduled', value: interviewingCount, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  // We can use the dynamic applications array for the list, slicing it for the recent jobs section
  const recentJobs = applications.slice(0, 3).map((app, index) => ({
    id: index,
    title: app.role,
    company: app.company,
    location: app.location,
    salary: 'Negotiable',
    match: 90, // Placeholder
    status: app.status,
    date: 'Recent'
  }));

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last30Days.map(date => {
    const dayApps = applications.filter(a => a.applied === date);
    return {
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      applications: dayApps.length,
      interviews: dayApps.filter(a => a.status === 'interviewing').length,
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'saved': return <Badge variant="secondary">Saved</Badge>;
      case 'applied': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Applied</Badge>;
      case 'interviewing': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-none">Interviewing</Badge>;
      case 'offer': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Offer</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back, {profile.name || 'Guest'}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your job search today.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Job Manually
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
          <CardTitle className="text-lg">Application Progress Board</CardTitle>
          <CardDescription>Visual tracker of your current job opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['saved', 'applied', 'interviewing', 'offer'].map((status) => {
              const columnApps = applications.filter(a => a.status === status);
              return (
                <div key={status} className="bg-gray-50 dark:bg-zinc-950/50 rounded-xl p-4 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{status}</h3>
                    <Badge variant="secondary">{columnApps.length}</Badge>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {columnApps.length === 0 ? (
                      <div className="text-sm text-gray-400 text-center mt-8">No applications</div>
                    ) : (
                      columnApps.map(app => (
                        <div key={app.id} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-primary transition-colors">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{app.role}</h4>
                          <p className="text-xs text-gray-500 mt-1">{app.company}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[10px] text-gray-400">{app.applied}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Activity Overview</CardTitle>
                  <CardDescription>Your applications and interviews over the last 30 days.</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 border-none"><TrendingUp size={14} /> +12% this week</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2 pl-0 pr-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                  />
                  <Line type="monotone" dataKey="applications" name="Applications" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="interviews" name="Interviews" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                  <CardDescription>Track the status of your latest job applications.</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentJobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No recent applications. Go to Job Search to find and apply for roles!
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h4>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5"><Building size={14} /> {job.company}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-medium">{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <Star size={12} className="fill-current" />
                          {job.match}% Match
                        </div>
                        <div className="text-xs text-gray-400">{job.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
              <CardDescription>Based on your profile and skills.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none">High Match</Badge>
                  <span className="text-xs text-gray-500">Just posted</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Staff Engineer</h4>
                  <p className="text-sm text-gray-500">Stripe • Remote</p>
                </div>
                <Button variant="default" className="w-full gap-2 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  <ExternalLink size={14} /> One-Click Apply
                </Button>
              </div>
              
              <div className="p-4 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Skill Gap</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Improve your Resume</h4>
                  <p className="text-sm text-gray-500">AI suggests adding 'GraphQL' to your skills based on your recent searches.</p>
                </div>
                <Button variant="outline" className="w-full">
                  Update Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
