'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { detectGesture, smoothLandmarks } from '@/utils/gesture-detection';
import { GestureType, HandLandmark } from '@/types/gesture';
import { PINCH_COOLDOWN, DOUBLE_PINCH_TIME } from '@/constants/gestures';

interface UseGestureDetectionProps {
  videoElement: HTMLVideoElement | null;
  onGestureChange: (gesture: GestureType | null) => void;
  onHandMove: (x: number, y: number) => void;
}

export default function useGestureDetection({
  videoElement,
  onGestureChange,
  onHandMove
}: UseGestureDetectionProps) {
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const previousLandmarksRef = useRef<HandLandmark[] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType | null>(null);
  
  const pinchStateRef = useRef({
    count: 0,
    lastTime: 0,
    mouseMode: false
  });

  const handleResults = useCallback((results: Results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      onGestureChange(null);
      return;
    }

    const landmarks = results.multiHandLandmarks[0] as HandLandmark[];
    const smoothedLandmarks = smoothLandmarks(landmarks, previousLandmarksRef.current);
    previousLandmarksRef.current = smoothedLandmarks;

    // Detect gesture
    const gesture = detectGesture(smoothedLandmarks);
    setCurrentGesture(gesture);
    
    // Handle pinch gesture for mouse mode
    if (gesture === 'pinch') {
      const now = Date.now();
      if (now - pinchStateRef.current.lastTime > PINCH_COOLDOWN) {
        pinchStateRef.current.count++;
        pinchStateRef.current.lastTime = now;
        
        if (pinchStateRef.current.count === 1) {
          setTimeout(() => {
            if (pinchStateRef.current.count === 1) {
              pinchStateRef.current.mouseMode = !pinchStateRef.current.mouseMode;
            }
            pinchStateRef.current.count = 0;
          }, DOUBLE_PINCH_TIME);
        } else if (pinchStateRef.current.count === 2) {
          // Double pinch = click
          console.log('Double pinch detected - click');
          pinchStateRef.current.count = 0;
        }
      }
    }
    
    onGestureChange(gesture);
    
    // Send hand position (index finger tip)
    const indexTip = smoothedLandmarks[8];
    if (indexTip && videoElement) {
      const x = (1 - indexTip.x) * videoElement.videoWidth;
      const y = indexTip.y * videoElement.videoHeight;
      onHandMove(x, y);
    }
  }, [videoElement, onGestureChange, onHandMove]);

  useEffect(() => {
    if (!videoElement) return;

    const initializeHands = async () => {
      try {
        handsRef.current = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
          }
        });

        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        handsRef.current.onResults(handleResults);

        cameraRef.current = new Camera(videoElement, {
          onFrame: async () => {
            if (handsRef.current) {
              await handsRef.current.send({ image: videoElement });
            }
          },
          width: 1280,
          height: 720
        });

        await cameraRef.current.start();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
    };

    initializeHands();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [videoElement, handleResults]);

  return { isReady, mouseMode: pinchStateRef.current.mouseMode, currentGesture };
}