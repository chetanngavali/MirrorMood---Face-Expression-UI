import React, { useState, useEffect } from 'react';
import { Music, Lightbulb, Target, Sparkles } from 'lucide-react';

interface ContentDisplayProps {
  mood: 'happy' | 'neutral' | 'bored' | 'angry';
  textColor: string;
  isReady: boolean;
}

const motivationalQuotes = [
  "Your energy today is contagious! Keep spreading those good vibes! ✨",
  "You're absolutely glowing! This positive energy suits you perfectly! 🌟",
  "That smile is your superpower! Keep lighting up the world! 😊",
  "Your happiness is creating ripples of joy everywhere you go! 🌊",
  "You're radiating pure sunshine today! Stay amazing! ☀️"
];

const surpriseFacts = [
  "Did you know? Octopuses have three hearts and blue blood! 🐙",
  "Fun fact: Honey never spoils! Archaeologists have found edible honey in Egyptian tombs! 🍯",
  "Amazing: A group of flamingos is called a 'flamboyance'! 💃",
  "Cool discovery: Bananas are berries, but strawberries aren't! 🍌",
  "Mind-blowing: There are more possible chess games than atoms in the observable universe! ♟️"
];

const chillMusic = [
  { name: "Lofi Hip Hop Radio", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
  { name: "Nature Sounds", url: "https://www.youtube.com/watch?v=ln3wAdRAim4" },
  { name: "Calm Piano", url: "https://www.youtube.com/watch?v=1ZYbU82GVz4" },
  { name: "Rain Sounds", url: "https://www.youtube.com/watch?v=mPZkdNFkNps" }
];

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ mood, textColor, isReady }) => {
  const [content, setContent] = useState<string>('');
  const [showMusicButton, setShowMusicButton] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    switch (mood) {
      case 'happy':
        setContent(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        setShowMusicButton(false);
        break;
      case 'bored':
        setContent(surpriseFacts[Math.floor(Math.random() * surpriseFacts.length)]);
        setShowMusicButton(false);
        break;
      case 'angry':
        setContent("Take a deep breath... You've got this! Let some chill music help you relax 🎵");
        setShowMusicButton(true);
        break;
      default:
        setContent("Welcome to MirrorMood! Your facial expressions will change this entire interface in real-time. Try smiling, looking bored, or making an angry face! 🎭");
        setShowMusicButton(false);
    }
  }, [mood, isReady]);

  const getIcon = () => {
    switch (mood) {
      case 'happy':
        return <Target className="h-6 w-6" />;
      case 'bored':
        return <Lightbulb className="h-6 w-6" />;
      case 'angry':
        return <Music className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getTitle = () => {
    switch (mood) {
      case 'happy':
        return "Motivation Boost";
      case 'bored':
        return "Surprise Fact";
      case 'angry':
        return "Chill Zone";
      default:
        return "Getting Started";
    }
  };

  const playRandomMusic = () => {
    const randomMusic = chillMusic[Math.floor(Math.random() * chillMusic.length)];
    window.open(randomMusic.url, '_blank');
  };

  if (!isReady) {
    return (
      <div className="text-center py-8">
        <div className={`${textColor} opacity-50`}>
          <Sparkles className="h-8 w-8 mx-auto mb-4 animate-pulse" />
          <p>Setting up your personalized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className={`flex items-center justify-center space-x-2 mb-6 ${textColor}`}>
        {getIcon()}
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
      </div>

      <div className={`${textColor} mb-8`}>
        <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
          {content}
        </p>
      </div>

      {showMusicButton && (
        <div className="animate-fadeIn">
          <button 
            onClick={playRandomMusic}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <Music className="h-5 w-5" />
            <span>Play Chill Music</span>
          </button>
          <p className={`text-sm mt-3 ${textColor} opacity-75`}>
            Open a relaxing music playlist in a new tab
          </p>
        </div>
      )}

      <div className={`mt-8 p-4 rounded-lg bg-white/10 ${textColor} opacity-75`}>
        <p className="text-sm">
          🎭 <strong>Pro tip:</strong> Try different facial expressions to see the magic happen!
          The UI responds to happy, neutral, bored, and angry emotions.
        </p>
      </div>
    </div>
  );
};