import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Sparkles, Loader2, Phone } from 'lucide-react';
import { auth, googleProvider, setCachedAccessToken } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');

  useEffect(() => {
    if (authMethod === 'phone') {
      setupRecaptcha();
    }
  }, [authMethod]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (e) {
        console.error('Recaptcha init error', e);
      }
    }
  };

  const getErrorMessage = (error: any) => {
    const code = error?.code || '';
    const msg = error?.message || '';
    
    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
      return "Domain not authorized. Please add this URL to Firebase Console > Authentication > Settings > Authorized domains.";
    }
    if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
      return "Sign in was cancelled.";
    }
    if (code === 'auth/invalid-phone-number' || msg.includes('invalid-phone-number')) {
      return "Invalid phone number. Please include the country code (e.g., +1234567890).";
    }
    if (code === 'auth/too-many-requests' || msg.includes('too-many-requests')) {
      return "Too many attempts. Please try again later.";
    }
    if (code === 'auth/invalid-verification-code' || msg.includes('invalid-verification-code')) {
      return "The verification code is incorrect.";
    }
    if (code === 'auth/invalid-api-key' || msg.includes('invalid-api-key')) {
      return "Firebase API Key is invalid. Check your Firebase configuration.";
    }
    if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found')) {
      return "Firebase Auth provider is not enabled in the Firebase Console.";
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

  const handleSendCode = async () => {
    if (!phoneNumber) return toast('Enter a valid phone number with country code (e.g., +1234567890)', 'error');
    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast("Verification code sent", "success");
    } catch (error: any) {
      console.error('Phone Send Code Error:', error);
      toast(getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult || !verificationCode) return;
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      if (result.user) {
        login();
        toast("Successfully signed in with Phone", "success");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Phone Verify Error:', error);
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
          <div className="flex gap-2 mb-4">
            <Button 
              variant={authMethod === 'google' ? 'default' : 'outline'} 
              className="flex-1" 
              onClick={() => setAuthMethod('google')}
            >
              Google
            </Button>
            <Button 
              variant={authMethod === 'phone' ? 'default' : 'outline'} 
              className="flex-1" 
              onClick={() => setAuthMethod('phone')}
            >
              Phone
            </Button>
          </div>

          {authMethod === 'google' ? (
            <div className="space-y-4">
              <Button className="w-full" size="lg" onClick={handleGoogleLogin} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in with Google
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="recaptcha-container"></div>
              {!confirmationResult ? (
                <>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Phone Number (e.g., +1234567890)" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleSendCode} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
                    Send Code
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Enter 6-digit Code" 
                      value={verificationCode} 
                      onChange={(e) => setVerificationCode(e.target.value)} 
                    />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleVerifyCode} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Verify & Sign in
                  </Button>
                </>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-500 mt-4">
            Securely sign in using Firebase Authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
