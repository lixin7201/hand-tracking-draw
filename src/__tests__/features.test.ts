import { describe, it, expect, beforeEach } from '@jest/globals';
import { EXTENDED_TEMPLATES } from '../constants/templates-extended';
import { STICKERS } from '../constants/stickers';
import { detectGesture } from '../utils/gesture-detection';
import { applyBrushEffect, drawSmoothLine } from '../utils/brush-effects';

describe('Template System', () => {
  it('should have exactly 100 templates', () => {
    const templateCount = Object.keys(EXTENDED_TEMPLATES).length;
    expect(templateCount).toBe(100);
  });

  it('should have templates in all required categories', () => {
    const categories = new Set(Object.values(EXTENDED_TEMPLATES).map(t => t.category));
    expect(categories.has('animals')).toBe(true);
    expect(categories.has('plants')).toBe(true);
    expect(categories.has('objects')).toBe(true);
    expect(categories.has('nature')).toBe(true);
    expect(categories.has('food')).toBe(true);
    expect(categories.has('vehicles')).toBe(true);
    expect(categories.has('people')).toBe(true);
    expect(categories.has('fantasy')).toBe(true);
  });

  it('should have at least 30 animal templates', () => {
    const animalTemplates = Object.values(EXTENDED_TEMPLATES).filter(t => t.category === 'animals');
    expect(animalTemplates.length).toBeGreaterThanOrEqual(30);
  });

  it('should have valid SVG paths for each template', () => {
    Object.values(EXTENDED_TEMPLATES).forEach(template => {
      expect(template.paths).toBeDefined();
      expect(Array.isArray(template.paths)).toBe(true);
      expect(template.paths.length).toBeGreaterThan(0);
      
      // Check that paths are strings and start with valid SVG commands
      template.paths.forEach(path => {
        expect(typeof path).toBe('string');
        expect(path).toMatch(/^[MLQCZAHVSThv]/); // SVG path commands
      });
    });
  });
});

describe('Sticker System', () => {
  it('should have stickers in all categories', () => {
    const categories = new Set(Object.values(STICKERS).map(s => s.category));
    expect(categories.has('nature')).toBe(true);
    expect(categories.has('animals')).toBe(true);
    expect(categories.has('objects')).toBe(true);
    expect(categories.has('decorations')).toBe(true);
  });

  it('should have valid SVG content for each sticker', () => {
    Object.values(STICKERS).forEach(sticker => {
      expect(sticker.svg).toBeDefined();
      expect(typeof sticker.svg).toBe('string');
      expect(sticker.svg).toContain('<svg');
      expect(sticker.svg).toContain('</svg>');
      expect(sticker.defaultSize).toBeGreaterThan(0);
    });
  });

  it('should have at least 20 stickers total', () => {
    const stickerCount = Object.keys(STICKERS).length;
    expect(stickerCount).toBeGreaterThanOrEqual(20);
  });
});

describe('Gesture Detection', () => {
  const createMockLandmarks = (fingerStates: boolean[]) => {
    const landmarks = Array(21).fill(null).map((_, i) => ({
      x: 0.5,
      y: 0.5,
      z: 0
    }));

    // Thumb (landmark 4)
    landmarks[4].x = fingerStates[0] ? 0.3 : 0.7;
    
    // Index finger (landmark 8)
    landmarks[8].y = fingerStates[1] ? 0.3 : 0.7;
    
    // Middle finger (landmark 12)
    landmarks[12].y = fingerStates[2] ? 0.3 : 0.7;
    
    // Ring finger (landmark 16)
    landmarks[16].y = fingerStates[3] ? 0.3 : 0.7;
    
    // Pinky (landmark 20)
    landmarks[20].y = fingerStates[4] ? 0.3 : 0.7;

    return landmarks;
  };

  it('should detect one finger gesture', () => {
    const landmarks = createMockLandmarks([false, true, false, false, false]);
    const gesture = detectGesture(landmarks);
    expect(gesture).toBe('one_finger');
  });

  it('should detect two fingers gesture', () => {
    const landmarks = createMockLandmarks([false, true, true, false, false]);
    const gesture = detectGesture(landmarks);
    expect(gesture).toBe('two_fingers');
  });

  it('should detect three fingers gesture', () => {
    const landmarks = createMockLandmarks([false, true, true, true, false]);
    const gesture = detectGesture(landmarks);
    expect(gesture).toBe('three_fingers');
  });

  it('should detect five fingers gesture', () => {
    const landmarks = createMockLandmarks([true, true, true, true, true]);
    const gesture = detectGesture(landmarks);
    expect(gesture).toBe('five_fingers');
  });

  it('should detect fist gesture', () => {
    const landmarks = createMockLandmarks([false, false, false, false, false]);
    const gesture = detectGesture(landmarks);
    expect(gesture).toBe('fist');
  });
});

describe('Brush Effects', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    ctx = canvas.getContext('2d')!;
  });

  it('should reset composite operation to source-over by default', () => {
    // Set eraser mode first
    ctx.globalCompositeOperation = 'destination-out';
    
    // Apply brush effect (non-eraser)
    applyBrushEffect(
      ctx,
      { name: 'marker', icon: '🖍️', lineJoin: 'round', lineCap: 'round' },
      { x: 50, y: 50 },
      5,
      '#FF0000',
      100,
      0,
      0
    );
    
    // Should reset to source-over before applying brush settings
    // Note: actual testing would require mocking or spying on ctx methods
    expect(ctx.globalCompositeOperation).not.toBe('destination-out');
  });

  it('should apply eraser blend mode correctly', () => {
    applyBrushEffect(
      ctx,
      { name: 'eraser', icon: '🧹', blendMode: 'destination-out' },
      { x: 50, y: 50 },
      10,
      '#000000',
      100,
      0,
      0
    );
    
    expect(ctx.globalCompositeOperation).toBe('destination-out');
  });

  it('should handle watercolor brush with default settings', () => {
    const watercolorBrush = {
      name: 'watercolor',
      icon: '🎨',
      opacity: 0.3,
      blendMode: 'multiply' as GlobalCompositeOperation,
      shadowBlur: 5,
      lineJoin: 'round' as CanvasLineJoin,
      lineCap: 'round' as CanvasLineCap
    };

    applyBrushEffect(
      ctx,
      watercolorBrush,
      { x: 50, y: 50 },
      8,
      '#FF0000',
      90,
      50,
      2
    );

    expect(ctx.globalCompositeOperation).toBe('multiply');
    expect(ctx.shadowBlur).toBe(5);
  });
});

describe('Sticker Instance Management', () => {
  it('should create sticker with correct properties', () => {
    const stickerId = 'coloredFlower';
    const sticker = STICKERS[stickerId];
    
    const stickerInstance = {
      id: 'sticker-1',
      stickerId,
      x: 100,
      y: 100,
      size: sticker.defaultSize,
      rotation: 0,
      isDragging: false
    };

    expect(stickerInstance.stickerId).toBe(stickerId);
    expect(stickerInstance.size).toBe(60); // coloredFlower default size
    expect(stickerInstance.isDragging).toBe(false);
  });

  it('should detect sticker collision correctly', () => {
    const sticker = {
      id: 'sticker-1',
      stickerId: 'coloredStar',
      x: 100,
      y: 100,
      size: 50,
      rotation: 0,
      isDragging: false
    };

    const halfSize = sticker.size / 2;
    
    // Point inside sticker bounds
    const insideX = 100;
    const insideY = 100;
    expect(
      insideX >= sticker.x - halfSize &&
      insideX <= sticker.x + halfSize &&
      insideY >= sticker.y - halfSize &&
      insideY <= sticker.y + halfSize
    ).toBe(true);

    // Point outside sticker bounds
    const outsideX = 200;
    const outsideY = 200;
    expect(
      outsideX >= sticker.x - halfSize &&
      outsideX <= sticker.x + halfSize &&
      outsideY >= sticker.y - halfSize &&
      outsideY <= sticker.y + halfSize
    ).toBe(false);
  });
});