import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Briefcase, FileText, Mail, Settings, UserCircle, Search, Menu, Bell, Users, LineChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useUser } from '../../context/UserContext';

export default function AppLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const { logout } = useUser();


  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Search', href: '/dashboard/search', icon: Search },
    { name: 'My Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Resume Builder', href: '/dashboard/resume', icon: FileText },
    { name: 'Email Outreach', href: '/dashboard/emails', icon: Mail },
    { name: 'Networking', href: '/dashboard/networking', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Briefcase size={20} />
            </div>
            AI Job Hunter
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon">
              <Menu size={20} />
            </Button>
            <div className="font-semibold text-lg">AI Job Hunter</div>
          </div>
          
          <div className="hidden md:flex font-medium text-gray-800 dark:text-gray-200 capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-900"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 font-medium flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Match Alert</p>
                    <p className="text-xs text-gray-500 mt-1">3 new jobs matched your profile at 90% or higher.</p>
                    <p className="text-xs text-gray-400 mt-2">10 mins ago</p>
                  </div>
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">RPA Bot Completed</p>
                    <p className="text-xs text-gray-500 mt-1">Successfully applied to 5 jobs automatically.</p>
                    <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Resume Optimized</p>
                    <p className="text-xs text-gray-500 mt-1">Your tailored resume for Google has been generated.</p>
                    <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100 dark:border-zinc-800 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-sm text-purple-600 font-medium">
                  View all
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 w-10 h-10 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                <UserCircle size={24} className="text-gray-600 dark:text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem render={<Link to="/dashboard/profile" />}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to="/dashboard/settings" />}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="w-full cursor-pointer text-red-600 focus:text-red-700" 
                  onSelect={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
