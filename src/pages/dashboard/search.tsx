import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, DollarSign, Filter, Sparkles, Building, Briefcase, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

export default function JobSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const mockResults = [
    { id: 1, title: 'Senior AI Engineer', company: 'DeepMind', location: 'London, UK (Hybrid)', salary: '$180k - $220k', match: 98, source: 'LinkedIn', posted: '2h ago' },
    { id: 2, title: 'Machine Learning Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200k - $250k', match: 95, source: 'Company Career Page', posted: '5h ago' },
    { id: 3, title: 'Full Stack Developer (AI Tools)', company: 'Anthropic', location: 'Remote', salary: '$160k - $190k', match: 89, source: 'Wellfound', posted: '1d ago' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1500); // Simulate API call
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">AI Job Search</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Search across LinkedIn, Indeed, Glassdoor, and company career pages simultaneously.</p>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Job title, keywords, or company" 
                className="pl-10 py-6 text-base bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="md:w-72 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="City, state, zip, or Remote" 
                className="pl-10 py-6 text-base bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="py-6 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={isSearching}>
              {isSearching ? 'Searching...' : (
                <>
                  <Sparkles size={18} />
                  Find Jobs
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 dark:border-zinc-800 pt-6">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Filter size={16} /> Filters:
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-9 px-3 gap-2 border-dashed bg-transparent hover:bg-accent hover:text-accent-foreground">
                  Salary <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>$100k+</DropdownMenuItem>
                <DropdownMenuItem>$150k+</DropdownMenuItem>
                <DropdownMenuItem>$200k+</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-9 px-3 gap-2 border-dashed bg-transparent hover:bg-accent hover:text-accent-foreground">
                  Work Mode <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Remote</DropdownMenuItem>
                <DropdownMenuItem>Hybrid</DropdownMenuItem>
                <DropdownMenuItem>On-site</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-9 px-3 gap-2 border-dashed bg-transparent hover:bg-accent hover:text-accent-foreground">
                  Experience <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Entry Level</DropdownMenuItem>
                <DropdownMenuItem>Mid Level</DropdownMenuItem>
                <DropdownMenuItem>Senior</DropdownMenuItem>
                <DropdownMenuItem>Executive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Matches for You</h2>
          <span className="text-sm text-gray-500">Showing 3 of 124 results</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-1 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-y-auto">
            {mockResults.map((job, idx) => (
              <div 
                key={job.id} 
                className={`p-5 cursor-pointer border-l-4 transition-colors ${idx === 0 ? 'border-l-primary bg-primary/5' : 'border-l-transparent hover:bg-gray-50 dark:hover:bg-zinc-800 border-b border-gray-100 dark:border-zinc-800'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">{job.match}% Match</Badge>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2"><Building size={16} className="text-gray-400" /> {job.company}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {job.location}</div>
                  <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-300"><DollarSign size={16} className="text-gray-400" /> {job.salary}</div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>via {job.source}</span>
                  <span>{job.posted}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 hidden lg:flex flex-col border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Senior AI Engineer</h2>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Building size={18} /> DeepMind</span>
                    <span className="flex items-center gap-1.5"><MapPin size={18} /> London, UK (Hybrid)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Save Job</Button>
                  <Button className="gap-2"><Sparkles size={16} /> Auto Apply</Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500" /> 
                  AI Match Analysis
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-800/20 text-sm text-purple-900 dark:text-purple-300 space-y-2">
                  <p><strong>Strengths:</strong> Your experience with PyTorch and Large Language Models perfectly aligns with their core requirements.</p>
                  <p><strong>Skill Gap:</strong> They mention 'Kubernetes' which is missing from your profile. AI recommends mentioning your Docker experience as a transferable skill in the cover letter.</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">About the Role</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
                  <p>DeepMind is looking for a Senior AI Engineer to join our core research and product team. You will be responsible for designing, training, and deploying next-generation foundation models.</p>
                  <h4 className="text-gray-900 dark:text-gray-100 font-medium">Responsibilities:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Design and implement scalable training pipelines for LLMs.</li>
                    <li>Optimize inference latency for production APIs.</li>
                    <li>Collaborate with researchers to transition prototypes to robust engineering solutions.</li>
                  </ul>
                  <h4 className="text-gray-900 dark:text-gray-100 font-medium">Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>5+ years of software engineering experience.</li>
                    <li>Deep expertise in Python, PyTorch, and CUDA.</li>
                    <li>Experience serving large models in production environments.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
