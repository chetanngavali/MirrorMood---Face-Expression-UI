import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Webcam } from './components/Webcam';
import { MoodIndicator } from './components/MoodIndicator';
import { ContentDisplay } from './components/ContentDisplay';
import { MoodProvider, useMood } from './hooks/useMood';

function AppContent() {
  const { currentMood, confidence, updateMood } = useMood();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setIsModelLoaded(true);
        console.log('Face-api models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };

    loadModels();
  }, []);

  const handleExpressionDetected = (expressions: any) => {
    if (!expressions) return;

    const expressionEntries = Object.entries(expressions);
    const [dominantExpression, confidence] = expressionEntries.reduce(
      (max, [expression, value]) => 
        (value as number) > max[1] ? [expression, value as number] : max,
      ['neutral', 0]
    );

    // Only update if confidence is high enough to avoid jittery changes
    if (confidence > 0.3) {
      let mood = 'neutral';
      
      if (dominantExpression === 'happy' && confidence > 0.4) {
        mood = 'happy';
      } else if ((dominantExpression === 'sad' || dominantExpression === 'disgusted') && confidence > 0.3) {
        mood = 'bored';
      } else if ((dominantExpression === 'angry' || dominantExpression === 'fearful') && confidence > 0.3) {
        mood = 'angry';
      }
      
      updateMood(mood as 'happy' | 'neutral' | 'bored' | 'angry', confidence);
    }
  };

  const getMoodStyles = () => {
    switch (currentMood) {
      case 'happy':
        return {
          background: 'linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4)',
          textColor: 'text-gray-800',
          cardBg: 'bg-white/90 backdrop-blur-sm',
        };
      case 'bored':
        return {
          background: 'linear-gradient(135deg, #8B7355, #A0937D, #C4B5A0)',
          textColor: 'text-white',
          cardBg: 'bg-white/20 backdrop-blur-sm',
        };
      case 'angry':
        return {
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
          textColor: 'text-white',
          cardBg: 'bg-white/20 backdrop-blur-sm',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          textColor: 'text-white',
          cardBg: 'bg-white/20 backdrop-blur-sm',
        };
    }
  };

  const styles = getMoodStyles();

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out relative overflow-hidden"
      style={{ background: styles.background }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor: 'white',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <header className={`text-center mb-8 ${styles.textColor}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 animate-pulse">
            MirrorMood
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Your Face, Your UI ✨
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Webcam Section */}
          <div className={`${styles.cardBg} rounded-2xl p-6 shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 ${styles.textColor}`}>
              Live Feed
            </h2>
            {!isModelLoaded ? (
              <div className={`text-center py-12 ${styles.textColor}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
                <p>Loading AI models...</p>
              </div>
            ) : (
              <Webcam
                onExpressionDetected={handleExpressionDetected}
                onWebcamReady={setIsWebcamReady}
              />
            )}
          </div>

          {/* Mood Indicator Section */}
          <div className={`${styles.cardBg} rounded-2xl p-6 shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 ${styles.textColor}`}>
              Mood Detector
            </h2>
            <MoodIndicator 
              currentMood={currentMood} 
              confidence={confidence}
              textColor={styles.textColor}
            />
          </div>
        </div>

        {/* Content Display - Full Width */}
        <div className={`max-w-6xl mx-auto mt-8 ${styles.cardBg} rounded-2xl p-8 shadow-2xl`}>
          <ContentDisplay 
            mood={currentMood}
            textColor={styles.textColor}
            isReady={isModelLoaded && isWebcamReady}
          />
        </div>

        {/* Footer */}
        <footer className={`text-center mt-12 ${styles.textColor} opacity-75`}>
          <p className="text-sm">
            🔒 Your privacy matters - everything runs in your browser, no data is sent anywhere
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <MoodProvider>
      <AppContent />
    </MoodProvider>
  );
}

export default App;