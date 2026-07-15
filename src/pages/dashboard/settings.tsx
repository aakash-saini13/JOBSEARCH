import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import MainAccountView from '../../components/auth/MainAccountView';

export default function Settings() {
  const { profile, updateProfile, firebaseUser } = useUser();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    emailAlerts: profile.preferences?.emailAlerts ?? true,
    browserNotifications: profile.preferences?.browserNotifications ?? true,
    googleCalendar: profile.preferences?.googleCalendar ?? false,
  });

  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile.preferences) {
      setPreferences({
        emailAlerts: profile.preferences.emailAlerts,
        browserNotifications: profile.preferences.browserNotifications,
        googleCalendar: profile.preferences.googleCalendar,
      });
    }
  }, [profile.preferences]);

  const handleTogglePreference = (key: keyof typeof preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    updateProfile({ preferences: newPreferences }, false);
    toast(`Preference updated`, 'success');
  };

  const isGoogleAuth = firebaseUser?.providerData.some(p => p.providerId === 'google.com');

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <MainAccountView />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Email Alerts</h4>
                  <p className="text-sm text-gray-500">Receive emails about job matches and interview reminders.</p>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${preferences.emailAlerts ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  onClick={() => handleTogglePreference('emailAlerts')}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Browser Notifications</h4>
                  <p className="text-sm text-gray-500">Get pop-up notifications for important events.</p>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${preferences.browserNotifications ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  onClick={() => handleTogglePreference('browserNotifications')}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.browserNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect external services to enhance your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Google Calendar</h4>
                  <p className="text-sm text-gray-500">Sync interviews with your calendar.</p>
                  {!isGoogleAuth && (
                    <p className="text-xs text-orange-500 mt-1">Requires Google Sign-in to enable Calendar integration.</p>
                  )}
                </div>
                <Button 
                  variant={preferences.googleCalendar ? "secondary" : "outline"}
                  onClick={() => handleTogglePreference('googleCalendar')}
                  disabled={!isGoogleAuth}
                  className={preferences.googleCalendar ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50" : ""}
                >
                  {preferences.googleCalendar ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Connected</> : "Connect"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">LinkedIn</h4>
                  <p className="text-sm text-gray-500">Import your profile and automate connection requests.</p>
                </div>
                <Button 
                  variant={linkedinConnected ? "secondary" : "outline"}
                  onClick={() => setLinkedinConnected(!linkedinConnected)}
                  className={linkedinConnected ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50" : ""}
                >
                  {linkedinConnected ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Connected</> : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
