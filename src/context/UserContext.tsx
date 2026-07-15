import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  title: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  experience?: { title: string; company: string; duration: string; description: string }[];
  education?: { degree: string; institution: string; year: string }[];
  preferredRoles?: string[];
  preferences?: { emailAlerts: boolean; browserNotifications: boolean; googleCalendar: boolean };
}

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'follow-up sent';
  applied: string;
  nextStep: string;
  hrEmail?: string;
  managerName?: string;
  url?: string;
  salary?: string;
  description?: string;
  notes?: string;
  source?: string;
  outreachAttempted?: boolean;
  outreachType?: "email" | "whatsapp";
}

export interface Email {
  id: string;
  subject: string;
  recipient: string;
  status: 'draft' | 'sent' | 'pending';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  metAt: string;
  lastContact: string;
  status: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>, showToast?: boolean) => void;
  logout: () => void;
  isLoggedIn: boolean;
  firebaseUser: import("firebase/auth").User | null;
  login: () => void;
  applications: Application[];
  applyForJob: (job: Omit<Application, 'id' | 'applied' | 'nextStep' | 'status'>) => void;
  addApplication: (app: Application) => Promise<void>;
  updateApplication: (appId: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (appId: string) => Promise<void>;
  emails: Email[];
  contacts: Contact[];
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  title: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  skills: []
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<import("firebase/auth").User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('user_applications');
    return saved ? JSON.parse(saved) : [];
  });
  const [emails, setEmails] = useState<Email[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserUid(user.uid);
        setFirebaseUser(user);
        
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile = { 
              ...defaultProfile, 
              name: user.displayName || '', 
              email: user.email || '',
              phone: user.phoneNumber || ''
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }

        try {
          const appsRef = collection(db, 'users', user.uid, 'applications');
          const appsSnap = await getDocs(appsRef);
          const loadedApps: Application[] = [];
          appsSnap.forEach((doc) => {
            loadedApps.push({ id: doc.id, ...doc.data() } as Application);
          });
          setApplications(loadedApps);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/applications`);
        }

        try {
          const emailsRef = collection(db, 'users', user.uid, 'emails');
          const emailsSnap = await getDocs(emailsRef);
          const loadedEmails: Email[] = [];
          emailsSnap.forEach((doc) => {
            loadedEmails.push({ id: doc.id, ...doc.data() } as Email);
          });
          setEmails(loadedEmails);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/emails`);
        }

        try {
          const contactsRef = collection(db, 'users', user.uid, 'contacts');
          const contactsSnap = await getDocs(contactsRef);
          const loadedContacts: Contact[] = [];
          contactsSnap.forEach((doc) => {
            loadedContacts.push({ id: doc.id, ...doc.data() } as Contact);
          });
          setContacts(loadedContacts);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/contacts`);
        }
      } else {
        setIsLoggedIn(false);
        setUserUid(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userUid) {
      setDoc(doc(db, 'users', userUid), profile).catch(error => {
        handleFirestoreError(error, OperationType.WRITE, `users/${userUid}`);
      });
    }
  }, [profile, userUid]);

  useEffect(() => {
    localStorage.setItem('user_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  const updateProfile = (updates: Partial<UserProfile>, showToast = true) => {
    setProfile(prev => ({ ...prev, ...updates }));
    if (showToast) {
      toast('Profile updated successfully', 'success');
    }
  };

  const addApplication = async (app: Application) => {
    setApplications(prev => [app, ...prev]);
    if (userUid) {
      try {
        await setDoc(doc(db, 'users', userUid, 'applications', app.id), app);
        // Sync to MongoDB for background cron jobs
        try {
          const token = await auth.currentUser?.getIdToken();
          await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...app, appliedDate: new Date(), profile, gmailToken: (await import('../lib/firebase')).cachedAccessToken })
          });
        } catch (e) { console.error('Failed to sync to MongoDB', e); }
        toast(`Successfully added application for ${app.company}`, 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${userUid}/applications/${app.id}`);
      }
    }
  };

  const updateApplication = async (appId: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, ...updates } : app));
    if (userUid) {
      try {
        await setDoc(doc(db, 'users', userUid, 'applications', appId), updates, { merge: true });
        toast(`Application updated successfully`, 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userUid}/applications/${appId}`);
      }
    }
  };

  const deleteApplication = async (appId: string) => {
    setApplications(prev => prev.filter(app => app.id !== appId));
    if (userUid) {
      try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'users', userUid, 'applications', appId));
        toast('Application deleted', 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userUid}/applications/${appId}`);
      }
    }
  };

  const applyForJob = async (job: Omit<Application, 'id' | 'applied' | 'nextStep' | 'status'>) => {
    const newApp: Application = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      status: 'applied',
      applied: new Date().toISOString().split('T')[0],
      nextStep: 'Waiting for response',
    };
    setApplications(prev => [newApp, ...prev]);
    if (userUid) {
      try {
        await setDoc(doc(db, 'users', userUid, 'applications', newApp.id), newApp);
        // Sync to MongoDB for background cron jobs
        try {
          const token = await auth.currentUser?.getIdToken();
          await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...newApp, appliedDate: new Date(), profile, gmailToken: (await import('../lib/firebase')).cachedAccessToken })
          });
        } catch (e) { console.error('Failed to sync to MongoDB', e); }
        toast(`Successfully applied to ${job.company}`, 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${userUid}/applications/${newApp.id}`);
      }
    } else {
      toast(`Successfully applied to ${job.company}`, 'success');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('user_applications');
    setProfile(defaultProfile);
    setIsLoggedIn(false);
    setUserUid(null);
        setFirebaseUser(null);
    setApplications([]);
    setEmails([]);
    setContacts([]);
    toast('Logged out successfully', 'success');
  };

  const login = () => {
    // Only used to trigger toast now, auth state is handled by onAuthStateChanged
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ profile, updateProfile, logout, isLoggedIn, firebaseUser, login, applications, applyForJob, addApplication, updateApplication, deleteApplication, emails, contacts }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
