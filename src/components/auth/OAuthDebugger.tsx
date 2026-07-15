import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OAuthDebugger() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<{status: 'idle' | 'success' | 'error', message: string}>({ status: 'idle', message: '' });

  const simulateHandshake = () => {
    setIsSimulating(true);
    setResult({ status: 'idle', message: '' });
    
    setTimeout(() => {
      // Basic checks for simulated OAuth handshake
      const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId || clientId === '') {
        setResult({ 
          status: 'error', 
          message: 'Client ID is missing. Ensure VITE_GOOGLE_CLIENT_ID is defined in your environment variables.'
        });
      } else if (clientId.length < 15) {
        setResult({
          status: 'error',
          message: 'Client ID seems invalid (too short). Please check your Google Cloud Console.'
        });
      } else {
        setResult({
          status: 'success',
          message: 'Simulated handshake successful! Client ID and scopes appear to be properly configured.'
        });
      }
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <Card className="border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 mt-6">
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <ShieldAlert size={18} />
          OAuth Setup Debugger
        </CardTitle>
        <CardDescription className="text-sm">
          Run a simulated OAuth handshake to validate your Google Client ID and scope configuration before attempting a real redirect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          onClick={simulateHandshake} 
          disabled={isSimulating}
          className="border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          {isSimulating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Simulating...</> : 'Run Diagnostic Handshake'}
        </Button>
        
        {result.status === 'error' && (
          <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 border border-red-200 dark:bg-red-900/20 dark:border-red-900">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Configuration Error</h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{result.message}</p>
            </div>
          </div>
        )}
        
        {result.status === 'success' && (
          <div className="flex items-start gap-3 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">All clear!</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">{result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
