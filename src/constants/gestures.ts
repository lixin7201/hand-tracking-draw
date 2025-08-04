export const GESTURES = {
  FIST: 'fist',
  ONE_FINGER: 'one_finger',
  TWO_FINGERS: 'two_fingers',
  FIVE_FINGERS: 'five_fingers',
  PINCH: 'pinch',
  PEACE: 'peace',
  OK: 'ok'
} as const;

export const GESTURE_DESCRIPTIONS = {
  [GESTURES.FIST]: '✊ 握拳: 停止绘制',
  [GESTURES.ONE_FINGER]: '☝️ 食指: 开始绘制',
  [GESTURES.TWO_FINGERS]: '✌️ 两指: 橡皮擦',
  [GESTURES.FIVE_FINGERS]: '🖐️ 五指: 清空画布',
  [GESTURES.PINCH]: '👌 捏合: 鼠标模式'
} as const;

export const PINCH_THRESHOLD = 30;
export const PINCH_COOLDOWN = 500;
export const DOUBLE_PINCH_TIME = 500;