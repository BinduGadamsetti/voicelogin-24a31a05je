"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaveformVisualizer from './waveform-visualizer';
import { useToast } from "@/hooks/use-toast";

type RecordingStatus = 'idle' | 'permission' | 'recording' | 'processing' | 'finished';

interface VoiceRecorderProps {
  onRecordingComplete: (dataUri: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  const getMicPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       toast({ variant: "destructive", title: "Error", description: "Media Devices API not supported in this browser." });
       return;
    }
    setStatus('permission');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      setStatus('idle');
      startRecording(stream);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please allow microphone access to record your voice." });
      setStatus('idle');
    }
  };

  const startRecording = (currentStream: MediaStream) => {
    setStatus('recording');
    
    // Setup Web Audio API for visualization
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    setAnalyserNode(analyser);

    const source = audioContext.createMediaStreamSource(currentStream);
    source.connect(analyser);

    // Setup MediaRecorder
    mediaRecorderRef.current = new MediaRecorder(currentStream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      setStatus('processing');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onRecordingComplete(base64String);
        setStatus('finished');
      };
    };
    
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
    stream?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    setStream(null);
    setAnalyserNode(null);
  };

  const handleButtonClick = () => {
    if (status === 'idle' || status === 'finished') {
      getMicPermission();
    } else if (status === 'recording') {
      stopRecording();
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
        stream?.getTracks().forEach(track => track.stop());
        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close();
        }
    };
  }, [stream]);

  const getButtonContent = () => {
    switch (status) {
      case 'idle':
        return <><Mic className="mr-2 h-5 w-5" /> Start Recording</>;
      case 'permission':
        return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Requesting Mic</>;
      case 'recording':
        return <><Square className="mr-2 h-5 w-5 text-red-500" /> Stop Recording</>;
      case 'processing':
        return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>;
      case 'finished':
        return <><CheckCircle2 className="mr-2 h-5 w-5 text-primary" /> Record Again</>;
      default:
        return <><AlertCircle className="mr-2 h-5 w-5" /> Error</>;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full h-24 rounded-lg bg-black/50 border border-input flex items-center justify-center overflow-hidden">
        {status === 'recording' && analyserNode ? (
          <WaveformVisualizer analyserNode={analyserNode} isRecording={status === 'recording'} />
        ) : (
          <p className="text-muted-foreground text-sm text-center px-4">
            {status === 'finished' ? 'Recording complete!' : "Recite the passphrase: 'My voice is my password'"}
          </p>
        )}
      </div>
      <Button onClick={handleButtonClick} disabled={status === 'permission' || status === 'processing'} className="w-full h-12 text-md">
        {getButtonContent()}
      </Button>
    </div>
  );
};

export default VoiceRecorder;
