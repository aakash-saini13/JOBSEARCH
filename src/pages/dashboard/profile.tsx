import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { UploadCloud, Loader2, Plus, Trash2 } from 'lucide-react';
import { useUser, UserProfile } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { parseResumeFile } from '../../services/resumeService';

export default function Profile() {
  const { profile: globalProfile, updateProfile } = useUser();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    ...globalProfile,
    experience: globalProfile.experience || [],
    education: globalProfile.education || [],
    preferredRoles: globalProfile.preferredRoles || []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    setProfile({
      ...globalProfile,
      experience: globalProfile.experience || [],
      education: globalProfile.education || [],
      preferredRoles: globalProfile.preferredRoles || []
    });
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
      } catch (error: any) {
        toast(error.message || 'Failed to parse resume', 'error');
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

  const handleRemoveRole = (roleToRemove: string) => {
    setProfile({
      ...profile,
      preferredRoles: profile.preferredRoles?.filter(role => role !== roleToRemove)
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...(profile.experience || []), { title: '', company: '', duration: '', description: '' }]
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...(profile.experience || [])];
    newExp[index] = { ...newExp[index], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  const removeExperience = (index: number) => {
    const newExp = [...(profile.experience || [])];
    newExp.splice(index, 1);
    setProfile({ ...profile, experience: newExp });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...(profile.education || []), { degree: '', institution: '', year: '' }]
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...(profile.education || [])];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setProfile({ ...profile, education: newEdu });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...(profile.education || [])];
    newEdu.splice(index, 1);
    setProfile({ ...profile, education: newEdu });
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
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
                <Label>Phone Number</Label>
                <Input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
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
          
          <Card>
            <CardHeader>
              <CardTitle>Preferred Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.preferredRoles?.map((role) => (
                  <Badge key={role} variant="secondary" className="px-3 py-1">
                    {role} <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleRemoveRole(role)}>&times;</span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Frontend Developer" 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRole.trim()) {
                      setProfile({...profile, preferredRoles: [...(profile.preferredRoles || []), newRole.trim()]});
                      setNewRole('');
                    }
                  }}
                />
                <Button variant="outline" onClick={() => {
                  if (newRole.trim()) {
                    setProfile({...profile, preferredRoles: [...(profile.preferredRoles || []), newRole.trim()]});
                    setNewRole('');
                  }
                }}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:col-span-2 space-y-6">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Experience</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience}><Plus size={16} className="mr-2"/> Add Experience</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience?.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg relative space-y-4">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => removeExperience(index)}>
                    <Trash2 size={16} />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input placeholder="e.g. Jan 2020 - Present" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
                  </div>
                </div>
              ))}
              {(!profile.experience || profile.experience.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No experience added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation}><Plus size={16} className="mr-2"/> Add Education</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education?.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg relative grid grid-cols-1 md:grid-cols-3 gap-4 pr-12">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => removeEducation(index)}>
                    <Trash2 size={16} />
                  </Button>
                  <div className="space-y-2">
                    <Label>Degree / Certification</Label>
                    <Input value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input placeholder="e.g. 2018 - 2022" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                  </div>
                </div>
              ))}
              {(!profile.education || profile.education.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No education added yet.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
