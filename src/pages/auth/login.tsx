import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { auth, googleProvider, setCachedAccessToken } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (error: any) => {
    const code = error?.code || '';
    const msg = error?.message || '';
    
    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
      return "Domain not authorized. Please add this URL to Firebase Console > Authentication > Settings > Authorized domains.";
    }
    if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
      return "Sign in was cancelled.";
    }
    if (code === 'auth/invalid-api-key' || msg.includes('invalid-api-key')) {
      return "Firebase API Key is invalid. Check your Firebase configuration.";
    }
    if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found')) {
      return "Firebase Auth provider is not enabled in the Firebase Console.";
    }
    if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
      return "Google sign-in is not enabled. Please enable it in the Firebase Console (Authentication > Sign-in method).";
    }
    
    return msg || "Authentication failed. Please try again.";
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setCachedAccessToken(credential.accessToken);
        }
        login();
        toast("Successfully signed in with Google", "success");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      toast(getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your AI Job Hunter Pro account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" size="lg" onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in with Google
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Securely sign in using Firebase Authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
