'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface VideoCanvasProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
}

export interface VideoCanvasRef {
  video: HTMLVideoElement | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ onVideoReady }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          videoRef.current.onloadedmetadata = () => {
            if (onVideoReady && videoRef.current) {
              onVideoReady(videoRef.current);
            }
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    useImperativeHandle(ref, () => ({
      video: videoRef.current,
      startCamera,
      stopCamera
    }));

    useEffect(() => {
      startCamera();
      
      return () => {
        stopCamera();
      };
    }, []);

    return (
      <div className="absolute top-0 left-0 w-full h-full z-[1]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden'
          }}
        />
      </div>
    );
  }
);

VideoCanvas.displayName = 'VideoCanvas';

export default VideoCanvas;