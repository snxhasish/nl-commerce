'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { Search, Mic } from 'lucide-react';

interface CommandBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function CommandBar({ onSearch, placeholder }: CommandBarProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput('');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    if (isListening) {
      recognition.abort();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              placeholder ||
              'Try: "show me black oversized hoodies under 2000" or "white sneakers for women"'
            }
            className="w-full px-4 py-3 bg-secondary text-foreground placeholder-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-3 rounded-lg border border-border transition-all ${
            isListening
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-foreground hover:bg-accent'
          }`}
          title="Voice search"
        >
          <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
        </button>

        <button
          type="submit"
          disabled={!input.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
}
