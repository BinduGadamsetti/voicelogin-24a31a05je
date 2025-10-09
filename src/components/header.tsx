"use client";

import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { VoiceKeyLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <VoiceKeyLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold font-headline">VoiceKey</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
         {user && <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.id}</span>}
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
