import React from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
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
          <Button className="w-full" size="lg" onClick={handleLogin}>
            Sign In to Dashboard
          </Button>
          <p className="text-center text-xs text-gray-500">
            This is a demo application. Clicking sign in will log you in automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
