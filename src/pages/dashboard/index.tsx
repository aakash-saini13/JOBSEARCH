import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Briefcase, CheckCircle, Mail, MapPin, Building, Star, ExternalLink, Calendar, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const stats = [
    { label: 'Total Jobs Saved', value: '124', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Applications Sent', value: '45', icon: Mail, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Interviews Scheduled', value: '3', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Offers Received', value: '1', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior Full Stack Engineer', company: 'TechCorp', location: 'Remote', salary: '$130k - $160k', match: 92, status: 'interviewing', date: '2d ago' },
    { id: 2, title: 'Frontend Developer (React)', company: 'Innovate AI', location: 'New York, NY', salary: '$110k - $140k', match: 88, status: 'applied', date: '3d ago' },
    { id: 3, title: 'Software Engineer II', company: 'Global Systems', location: 'San Francisco, CA', salary: '$140k - $170k', match: 85, status: 'saved', date: '5d ago' },
  ];

  const chartData = [
    { name: 'Mon', applications: 2, interviews: 0 },
    { name: 'Tue', applications: 5, interviews: 1 },
    { name: 'Wed', applications: 3, interviews: 0 },
    { name: 'Thu', applications: 8, interviews: 0 },
    { name: 'Fri', applications: 4, interviews: 2 },
    { name: 'Sat', applications: 7, interviews: 0 },
    { name: 'Sun', applications: 1, interviews: 0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'saved': return <Badge variant="secondary">Saved</Badge>;
      case 'applied': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Applied</Badge>;
      case 'interviewing': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-none">Interviewing</Badge>;
      case 'offer': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Offer</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back, Alex</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Activity Overview</CardTitle>
                  <CardDescription>Your applications and interviews over the last 7 days.</CardDescription>
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
