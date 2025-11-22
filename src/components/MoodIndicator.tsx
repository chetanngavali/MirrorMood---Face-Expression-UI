import React from 'react';
import { Smile, Meh, Coffee, Zap } from 'lucide-react';

interface MoodIndicatorProps {
  currentMood: 'happy' | 'neutral' | 'bored' | 'angry';
  confidence: number;
  textColor: string;
}

export const MoodIndicator: React.FC<MoodIndicatorProps> = ({ 
  currentMood, 
  confidence, 
  textColor 
}) => {
  const getMoodIcon = () => {
    switch (currentMood) {
      case 'happy':
        return <Smile className="h-8 w-8 text-yellow-400" />;
      case 'bored':
        return <Coffee className="h-8 w-8 text-blue-400" />;
      case 'angry':
        return <Zap className="h-8 w-8 text-purple-400" />;
      default:
        return <Meh className="h-8 w-8 text-gray-400" />;
    }
  };

  const getMoodDescription = () => {
    switch (currentMood) {
      case 'happy':
        return 'Feeling Great! 😊';
      case 'bored':
        return 'Looking Chill 😌';
      case 'angry':
        return 'Need Some Zen? 🧘‍♀️';
      default:
        return 'Neutral Vibes 😐';
    }
  };

  const getMoodColor = () => {
    switch (currentMood) {
      case 'happy':
        return 'text-yellow-400';
      case 'bored':
        return 'text-blue-400';
      case 'angry':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4 animate-bounce">
        {getMoodIcon()}
      </div>
      
      <h3 className={`text-2xl font-bold mb-2 ${getMoodColor()}`}>
        {getMoodDescription()}
      </h3>
      
      <div className={`mb-4 ${textColor}`}>
        <p className="text-sm opacity-75 mb-2">Confidence</p>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(confidence * 100)}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 opacity-60">
          {Math.round(confidence * 100)}%
        </p>
      </div>
      
      <div className={`text-sm ${textColor} opacity-75`}>
        <p>Current Mood: <span className="font-semibold capitalize">{currentMood}</span></p>
      </div>
    </div>
  );
};