"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { analyzeSecurity } from '@/lib/actions';
import type { EnhanceVoicePrintSecurityOutput } from '@/ai/flows/enhance-voice-print-security';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, ShieldCheck, ShieldAlert, Bot, Cloud } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SecurityAnalysis() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EnhanceVoicePrintSecurityOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!user?.voicePrint) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No voice print found for analysis.",
      });
      return;
    }
    
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeSecurity({
      voicePrintDataUri: user.voicePrint,
      userId: user.id,
    });

    setIsLoading(false);
    
    if (result.success && result.data) {
      setAnalysisResult(result.data);
      toast({
        title: "Analysis Complete",
        description: "Security assessment has been updated.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const ThreatLevelBadge = ({ level }: { level: string }) => {
    switch (level.toLowerCase()) {
      case 'low':
        return <Badge variant="secondary" className='bg-green-500/20 text-green-400 border-green-500/40'><ShieldCheck className='mr-2 h-4 w-4' />Low</Badge>;
      case 'medium':
        return <Badge variant="secondary" className='bg-yellow-500/20 text-yellow-400 border-yellow-500/40'><ShieldAlert className='mr-2 h-4 w-4' />Medium</Badge>;
      case 'high':
        return <Badge variant="destructive" className='bg-red-500/20 text-red-400 border-red-500/40'><ShieldAlert className='mr-2 h-4 w-4' />High</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-xl">AI-Enhanced Security</CardTitle>
        </div>
        <CardDescription>
          Actively monitor and enhance your voice print security. Our AI analyzes your voice data for potential threats like cloning or mimicking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">Analyzing voice print...</p>
          </div>
        ) : analysisResult ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">Security Assessment</h3>
                    <p className={`text-2xl font-bold ${analysisResult.securityAssessment.isSecure ? 'text-primary' : 'text-destructive'}`}>
                        {analysisResult.securityAssessment.isSecure ? 'Secure' : 'Insecure'}
                    </p>
                </div>
                <div className='text-right'>
                    <h3 className="font-semibold">Threat Level</h3>
                    <ThreatLevelBadge level={analysisResult.securityAssessment.threatLevel} />
                </div>
            </div>
            
            <div>
              <h4 className="font-semibold">Anomalies Detected</h4>
              {analysisResult.securityAssessment.anomaliesDetected.length > 0 ? (
                <ul className="list-disc list-inside text-muted-foreground text-sm pl-2">
                  {analysisResult.securityAssessment.anomaliesDetected.map((anomaly, index) => <li key={index}>{anomaly}</li>)}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No anomalies detected.</p>}
            </div>

            <div>
              <h4 className="font-semibold">Recommended Actions</h4>
              {analysisResult.securityAssessment.recommendedActions.length > 0 ? (
                 <ul className="list-disc list-inside text-muted-foreground text-sm pl-2">
                  {analysisResult.securityAssessment.recommendedActions.map((action, index) => <li key={index}>{action}</li>)}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No specific actions recommended at this time.</p>}
            </div>
             {analysisResult.securityAssessment.voiceWordCloud && (
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Voice Word Cloud
                </h4>
                <p className="text-sm text-muted-foreground italic p-4 bg-muted/50 rounded-lg mt-2">
                  {analysisResult.securityAssessment.voiceWordCloud}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold">Ready to run security scan</h3>
            <p className="mt-2 text-sm text-muted-foreground">Click the button below to start the analysis.</p>
          </div>
        )}
      </CardContent>
      <CardContent>
        <Button onClick={handleAnalysis} disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            'Run Security Analysis'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
