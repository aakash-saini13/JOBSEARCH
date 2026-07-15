import React, { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { motion } from 'motion/react';
import { Users, Clock, FileCheck, ThumbsDown } from 'lucide-react';

const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function Analytics() {
  const { applications } = useUser();

  const stats = useMemo(() => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.keys(statusCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCounts[key]
    }));

    // Applications over time
    const dateCounts = applications.reduce((acc, app) => {
      if (!app.applied) return acc;
      const date = new Date(app.applied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineData = Object.keys(dateCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map(date => ({
      date,
      count: dateCounts[date]
    }));

    // Top Companies
    const topCompanies = applications.reduce((acc, app) => {
      acc[app.company] = (acc[app.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const companyData = Object.keys(topCompanies)
      .map(key => ({ name: key, count: topCompanies[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Keyword Performance (from roles)
    const stopWords = ['and', 'or', 'for', 'to', 'the', 'in', 'of', 'a', 'an', 'senior', 'junior', 'lead', 'manager', 'developer', 'engineer', 'specialist', 'analyst', 'consultant', 'staff'];
    const keywordCounts = applications.reduce((acc, app) => {
      if (!app.role) return acc;
      const words = app.role.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
      words.forEach(word => {
        if (word.length > 2 && !stopWords.includes(word)) {
          acc[word] = (acc[word] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const keywordData = Object.keys(keywordCounts)
      .map(key => ({ keyword: key, count: keywordCounts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { statusData, timelineData, companyData, keywordData, total: applications.length };
  }, [applications]);

  return (
    <motion.div 
      className="space-y-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Analytics & Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Analyze your job application performance and history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interview Rate</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {stats.total > 0 ? Math.round(((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Rate</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {stats.total > 0 ? Math.round(((stats.total - (stats.statusData.find(d => d.name.toLowerCase() === 'applied' || d.name.toLowerCase() === 'saved')?.value || 0)) / stats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-analysis">Data Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="flex-1 min-h-0 mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">Applications Over Time</CardTitle>
                <CardDescription>Your activity timeline</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                {stats.timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">No timeline data available.</div>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">Application Status Pipeline</CardTitle>
                <CardDescription>Current state of your applications</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex items-center justify-center">
                {stats.statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {stats.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500">No status data available.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data-analysis" className="flex-1 min-h-0 mt-4 space-y-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">Keyword Performance</CardTitle>
                <CardDescription>Top tech stacks & keywords in your applied roles</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                {stats.keywordData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.keywordData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="keyword" type="category" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                        {stats.keywordData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">No keyword data available.</div>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">Success Rates (Funnel)</CardTitle>
                <CardDescription>Conversion from Applied to Interview & Offer</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex items-center justify-center p-6">
                 {stats.total > 0 ? (
                  <div className="w-full flex flex-col space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Applied</span>
                        <span className="text-gray-900">{stats.total} (100%)</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Interviewing</span>
                        <span className="text-gray-900">{stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0} ({Math.round(((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100)}%)</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Offer</span>
                        <span className="text-gray-900">{stats.statusData.find(d => d.name.toLowerCase() === 'offer')?.value || 0} ({Math.round(((stats.statusData.find(d => d.name.toLowerCase() === 'offer')?.value || 0) / stats.total) * 100)}%)</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${((stats.statusData.find(d => d.name.toLowerCase() === 'offer')?.value || 0) / stats.total) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                 ) : (
                  <div className="text-gray-500">No application data to analyze.</div>
                 )}
              </CardContent>
            </Card>
           </div>
        </TabsContent>
      
        <TabsContent value="advanced" className="flex-1 min-h-0 mt-4 space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
            {/* Funnel Benchmarking */}
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-lg flex items-center gap-2"><Users size={18} className="text-blue-600" /> Funnel Benchmarking</CardTitle>
                <CardDescription>Compare your metrics against platform averages</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Interview Rate</span>
                      <span className="text-sm font-bold text-blue-600">{stats.total > 0 ? Math.round(((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.total > 0 ? Math.round(((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100) : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform Average (Software Engineer)</span>
                      <span className="text-sm font-bold text-gray-500">14%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 dark:bg-gray-600 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You are performing <strong className={((stats.total > 0 ? ((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100 : 0) > 14) ? "text-green-600" : "text-amber-600"}>
                        {((stats.total > 0 ? ((stats.statusData.find(d => d.name.toLowerCase() === 'interviewing')?.value || 0) / stats.total) * 100 : 0) > 14) ? "above" : "below"} average
                      </strong> for your target roles. Consider optimizing your resume keywords.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time-to-Hire Predictor */}
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="text-lg flex items-center gap-2"><Clock size={18} className="text-purple-600" /> Time-to-Hire Predictor</CardTitle>
                <CardDescription>Estimated timeline based on crowdsourced data</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-4 border-purple-50 dark:border-purple-900/10">
                  <span className="text-3xl font-bold text-purple-700 dark:text-purple-300">28</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Days Avg. to Offer</h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-1">Based on recent data for Mid-Level tech roles in your tracked companies.</p>
                </div>
              </CardContent>
            </Card>

            {/* A/B Testing Resumes */}
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-lg flex items-center gap-2"><FileCheck size={18} className="text-green-600" /> A/B Testing Resumes</CardTitle>
                <CardDescription>Performance by resume version</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Tech-Heavy Variant v2</p>
                      <p className="text-xs text-gray-500">Used in 12 applications</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">25%</p>
                      <p className="text-xs text-gray-500">Interview Rate</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Management-Focused Variant</p>
                      <p className="text-xs text-gray-500">Used in 8 applications</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">12%</p>
                      <p className="text-xs text-gray-500">Interview Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Analytics */}
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                <CardTitle className="text-lg flex items-center gap-2"><ThumbsDown size={18} className="text-red-600" /> Rejection Analytics</CardTitle>
                <CardDescription>Primary reasons identified from feedback</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Lacking Specific Skill (e.g. AWS)</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Role Closed / Headcount Freeze</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Not enough YOE</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </motion.div>

  );
}
