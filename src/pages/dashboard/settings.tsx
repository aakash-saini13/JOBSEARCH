import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

export default function Settings() {
  const { profile, updateProfile } = useUser();
  const { toast } = useToast();
  
  const [googleConnected, setGoogleConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [formData, setFormData] = useState({ name: profile.name, email: profile.email });

  useEffect(() => {
    setFormData({ name: profile.name, email: profile.email });
  }, [profile]);

  const handleSaveAccount = () => {
    updateProfile(formData);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
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
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <Button onClick={handleSaveAccount}>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Alerts</h4>
                  <p className="text-sm text-gray-500">Receive emails about job matches and interview reminders.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Browser Notifications</h4>
                  <p className="text-sm text-gray-500">Get pop-up notifications for important events.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect external services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500">Sync interviews with your calendar.</p>
                </div>
                <Button 
                  variant={googleConnected ? "secondary" : "outline"}
                  onClick={() => setGoogleConnected(!googleConnected)}
                  className={googleConnected ? "text-green-600 bg-green-50 border-green-200" : ""}
                >
                  {googleConnected ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Connected</> : "Connect"}
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="font-medium">LinkedIn</h4>
                  <p className="text-sm text-gray-500">Import your profile and experience.</p>
                </div>
                <Button 
                  variant={linkedinConnected ? "secondary" : "outline"}
                  onClick={() => setLinkedinConnected(!linkedinConnected)}
                  className={linkedinConnected ? "text-green-600 bg-green-50 border-green-200" : ""}
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
