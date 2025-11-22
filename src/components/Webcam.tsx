import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamProps {
  onExpressionDetected: (expressions: any) => void;
  onWebcamReady: (ready: boolean) => void;
}

export const Webcam: React.FC<WebcamProps> = ({ onExpressionDetected, onWebcamReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const detectionIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
          onWebcamReady(true);
          startFaceDetection();
        };
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Camera access denied. Please enable camera permissions and refresh.');
      onWebcamReady(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    setIsStreaming(false);
    onWebcamReady(false);
  };

  const startFaceDetection = () => {
    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections && detections.length > 0) {
          const expressions = detections[0].expressions;
          onExpressionDetected(expressions);

          // Clear canvas and draw new detections
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw face detection box
            const detection = detections[0].detection;
            ctx.strokeStyle = '#4ECDC4';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              detection.box.x,
              detection.box.y,
              detection.box.width,
              detection.box.height
            );
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    // Run detection every 500ms to balance performance and responsiveness
    detectionIntervalRef.current = setInterval(detectFaces, 500);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <CameraOff className="h-16 w-16 mx-auto mb-4 text-red-400" />
        <p className="text-red-300 mb-4">{error}</p>
        <button 
          onClick={() => {
            setError('');
            startWebcam();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto max-w-full"
          style={{ transform: 'scaleX(-1)' }} // Mirror effect
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
          width="640"
          height="480"
        />
        
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {isStreaming ? (
            <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              <Camera className="h-4 w-4" />
              <span>Live</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
              Connecting...
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center mt-3 text-sm opacity-75">
        Position your face in the frame for mood detection
      </p>
    </div>
  );
};