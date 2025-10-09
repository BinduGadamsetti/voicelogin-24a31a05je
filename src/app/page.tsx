"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { VoiceKeyLogo } from '@/components/icons';
import VoiceRecorder from '@/components/voice-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!audioData) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Please record your voice passphrase first.",
      });
      return;
    }
    setIsAuthenticating(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = login(audioData);

    if (success) {
      toast({
        title: "Authentication Successful",
        description: "Welcome back!",
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Voice print not recognized. Please try again or register.",
      });
      setIsAuthenticating(false);
      setAudioData(null); // Reset audio data on failure
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <VoiceKeyLogo className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter text-center font-headline">
          Welcome to VoiceKey
        </h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Authenticate using your unique voice print. Secure, fast, and personal.
        </p>
      </div>

      <Card className="w-full max-w-md mt-8 shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Voice Authentication</CardTitle>
          <CardDescription>Record your voice passphrase to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceRecorder onRecordingComplete={setAudioData} />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            onClick={handleLogin} 
            disabled={isAuthenticating || !audioData} 
            className="w-full h-12 text-lg"
          >
            {isAuthenticating ? <Loader2 className="animate-spin" /> : 'Authenticate'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
