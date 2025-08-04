'use client';

import { GESTURE_DESCRIPTIONS, GESTURES } from '@/constants/gestures';

export default function GestureIndicator() {
  return (
    <div className="fixed top-[90px] left-5 z-[5] bg-white/95 p-4 rounded-[10px] backdrop-blur-md max-w-[200px] shadow-lg">
      <h3 className="mb-2.5 text-gray-800 text-base font-semibold">手势说明</h3>
      <div className="space-y-1">
        <p className="text-gray-600 text-xs">{GESTURE_DESCRIPTIONS[GESTURES.FIST]}</p>
        <p className="text-gray-600 text-xs">{GESTURE_DESCRIPTIONS[GESTURES.ONE_FINGER]}</p>
        <p className="text-gray-600 text-xs">{GESTURE_DESCRIPTIONS[GESTURES.TWO_FINGERS]}</p>
        <p className="text-gray-600 text-xs">{GESTURE_DESCRIPTIONS[GESTURES.FIVE_FINGERS]}</p>
        <p className="text-gray-600 text-xs">{GESTURE_DESCRIPTIONS[GESTURES.PINCH]}</p>
        <p className="text-[10px] text-gray-400 mt-1">连续捏合2次=点击</p>
      </div>
    </div>
  );
}