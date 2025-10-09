"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { VoiceKeyLogo } from '@/components/icons';
import VoiceRecorder from '@/components/voice-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!audioData || !username) {
       toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please provide a username and record your voice passphrase.",
      });
      return;
    }
    setIsRegistering(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = register(username, audioData);

    if (success) {
      toast({
        title: "Registration Successful",
        description: "Your VoiceKey has been created. Please log in.",
      });
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "A user with this username already exists.",
      });
      setIsRegistering(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <VoiceKeyLogo className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter text-center font-headline">
          Create Your VoiceKey
        </h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Register a unique voice print to secure your account.
        </p>
      </div>

      <Card className="w-full max-w-md mt-8 shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">New User Registration</CardTitle>
          <CardDescription>Enter a username and record your voice passphrase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username" 
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Voice Passphrase</Label>
            <VoiceRecorder onRecordingComplete={setAudioData} />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            onClick={handleRegister} 
            disabled={isRegistering || !audioData || !username} 
            className="w-full h-12 text-lg"
          >
            {isRegistering ? <Loader2 className="animate-spin" /> : 'Create VoiceKey'}
          </Button>
           <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
