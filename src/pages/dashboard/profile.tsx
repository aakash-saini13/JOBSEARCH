import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useUser, UserProfile } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { parseResumeFile } from '../../services/resumeService';

export default function Profile() {
  const { profile: globalProfile, updateProfile } = useUser();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(globalProfile);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setProfile(globalProfile);
  }, [globalProfile]);

  const handleSave = () => {
    updateProfile(profile);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const extractedData = await parseResumeFile(e.target.files[0]);
        const updatedProfile = { ...profile, ...extractedData };
        setProfile(updatedProfile);
        updateProfile(updatedProfile, false);
        toast('Resume parsed successfully!', 'success');
      } catch (error) {
        toast('Failed to parse resume', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your professional information for AI matching.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button variant="outline" className="gap-2" disabled={isUploading}>
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {isUploading ? 'Parsing...' : 'Upload Resume'}
            </Button>
          </div>
          <Button onClick={handleSave}>Save Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Professional Title</Label>
                <Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input value={profile.linkedin} onChange={(e) => setProfile({...profile, linkedin: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Portfolio / GitHub</Label>
                <Input value={profile.github} onChange={(e) => setProfile({...profile, github: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[120px]" 
                value={profile.summary}
                onChange={(e) => setProfile({...profile, summary: e.target.value})}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Core Skills</CardTitle>
              <CardDescription>Add skills to improve AI job matching.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill} <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleRemoveSkill(skill)}>&times;</span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a skill..." 
                  className="max-w-[200px]" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkill.trim()) {
                      setProfile({...profile, skills: [...profile.skills, newSkill.trim()]});
                      setNewSkill('');
                    }
                  }}
                />
                <Button variant="outline" onClick={() => {
                  if (newSkill.trim()) {
                    setProfile({...profile, skills: [...profile.skills, newSkill.trim()]});
                    setNewSkill('');
                  }
                }}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
