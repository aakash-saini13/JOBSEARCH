import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button, buttonVariants } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function MainAccountView() {
  const { profile, updateProfile, firebaseUser } = useUser();
  const [formData, setFormData] = useState({ name: profile.name, email: profile.email, phone: profile.phone || '' });
  
  // Real connection state from Firebase Auth
  const isAuthConnected = !!firebaseUser;
  const isPhoneAuth = firebaseUser?.providerData.some(p => p.providerId === 'phone');
  const isGoogleAuth = firebaseUser?.providerData.some(p => p.providerId === 'google.com');

  useEffect(() => {
    setFormData({ name: profile.name, email: profile.email, phone: profile.phone || '' });
  }, [profile]);

  const handleSaveAccount = () => {
    updateProfile(formData);
  };

  return (
    <div className="space-y-6">
      {isAuthConnected ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-4 py-1.5 px-3">
          <CheckCircle2 size={14} className="mr-1.5" />
          {isGoogleAuth ? 'Google Account Connected' : isPhoneAuth ? 'Phone Account Connected' : 'Account Connected'}
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4 py-1.5 px-3">
          <ShieldAlert size={14} className="mr-1.5" />
          Account Disconnected
        </Badge>
      )}
      
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
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <Button onClick={handleSaveAccount}>Save Changes</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your authentication method.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Authentication Method</Label>
            <Input 
              disabled 
              value={isGoogleAuth ? "Google OAuth" : isPhoneAuth ? "Phone Number Verification" : "Email / Password"} 
            />
            <p className="text-xs text-gray-500 mt-1">Your account uses {isGoogleAuth ? "Google's secure OAuth login" : "Firebase secure authentication"}. You don't need a separate password for this app.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
