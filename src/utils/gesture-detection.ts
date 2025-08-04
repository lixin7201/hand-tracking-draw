import { HandLandmark, GestureType } from '@/types/gesture';
import { PINCH_THRESHOLD } from '@/constants/gestures';

export function detectGesture(landmarks: HandLandmark[]): GestureType | null {
  if (!landmarks || landmarks.length === 0) return null;

  const fingerTips = [4, 8, 12, 16, 20];
  const fingerBases = [2, 5, 9, 13, 17];
  
  let extendedFingers = 0;
  const fingerStates = [];

  // Check thumb
  if (landmarks[4].x < landmarks[2].x) {
    extendedFingers++;
    fingerStates[0] = true;
  } else {
    fingerStates[0] = false;
  }

  // Check other fingers
  for (let i = 1; i < 5; i++) {
    if (landmarks[fingerTips[i]].y < landmarks[fingerBases[i]].y) {
      extendedFingers++;
      fingerStates[i] = true;
    } else {
      fingerStates[i] = false;
    }
  }

  // Detect pinch gesture
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const distance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) + 
    Math.pow(thumbTip.y - indexTip.y, 2)
  ) * 500;

  if (distance < PINCH_THRESHOLD && extendedFingers <= 2) {
    return 'pinch';
  }

  // Detect other gestures
  if (extendedFingers === 0) {
    return 'fist';
  } else if (extendedFingers === 1 && fingerStates[1]) {
    return 'one_finger';
  } else if (extendedFingers === 2 && fingerStates[1] && fingerStates[2]) {
    return 'two_fingers';
  } else if (extendedFingers === 3 && fingerStates[1] && fingerStates[2] && fingerStates[3]) {
    return 'three_fingers';
  } else if (extendedFingers === 5) {
    return 'five_fingers';
  }

  return null;
}

export function smoothLandmarks(
  current: HandLandmark[],
  previous: HandLandmark[] | null,
  alpha: number = 0.7
): HandLandmark[] {
  if (!previous) return current;
  
  return current.map((point, i) => ({
    x: alpha * point.x + (1 - alpha) * previous[i].x,
    y: alpha * point.y + (1 - alpha) * previous[i].y,
    z: alpha * point.z + (1 - alpha) * previous[i].z
  }));
}