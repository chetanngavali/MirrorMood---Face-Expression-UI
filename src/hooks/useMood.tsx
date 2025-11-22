import React, { createContext, useContext, useState, ReactNode } from 'react';

type Mood = 'happy' | 'neutral' | 'bored' | 'angry';

interface MoodContextType {
  currentMood: Mood;
  confidence: number;
  updateMood: (mood: Mood, confidence: number) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');
  const [confidence, setConfidence] = useState<number>(0);

  const updateMood = (mood: Mood, confidence: number) => {
    // Add some smoothing to prevent rapid mood changes
    if (mood !== currentMood || Math.abs(confidence - confidence) > 0.1) {
      setCurrentMood(mood);
      setConfidence(confidence);
    }
  };

  return (
    <MoodContext.Provider value={{ currentMood, confidence, updateMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};