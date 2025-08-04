export interface Sticker {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'animals' | 'objects' | 'decorations';
  svg: string; // SVG content as string
  defaultSize: number;
}

export const STICKERS: Record<string, Sticker> = {
  // NATURE STICKERS
  coloredFlower: {
    id: 'coloredFlower',
    name: '彩色花朵',
    icon: '🌺',
    category: 'nature',
    defaultSize: 60,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Petals -->
        <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#FF69B4" transform="rotate(0)"/>
        <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#FF1493" transform="rotate(72)"/>
        <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#FF69B4" transform="rotate(144)"/>
        <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#FF1493" transform="rotate(216)"/>
        <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#FF69B4" transform="rotate(288)"/>
        <!-- Center -->
        <circle cx="0" cy="0" r="12" fill="#FFD700"/>
        <circle cx="-3" cy="-2" r="2" fill="#FFA500"/>
        <circle cx="3" cy="-2" r="2" fill="#FFA500"/>
        <circle cx="0" cy="3" r="2" fill="#FFA500"/>
      </g>
    </svg>`
  },
  
  coloredSun: {
    id: 'coloredSun',
    name: '彩色太阳',
    icon: '🌞',
    category: 'nature',
    defaultSize: 80,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Rays -->
        <g stroke="#FFA500" stroke-width="3" fill="none">
          <line x1="0" y1="-30" x2="0" y2="-40"/>
          <line x1="21" y1="-21" x2="28" y2="-28"/>
          <line x1="30" y1="0" x2="40" y2="0"/>
          <line x1="21" y1="21" x2="28" y2="28"/>
          <line x1="0" y1="30" x2="0" y2="40"/>
          <line x1="-21" y1="21" x2="-28" y2="28"/>
          <line x1="-30" y1="0" x2="-40" y2="0"/>
          <line x1="-21" y1="-21" x2="-28" y2="-28"/>
        </g>
        <!-- Face -->
        <circle cx="0" cy="0" r="25" fill="#FFD700"/>
        <circle cx="-8" cy="-5" r="3" fill="#333"/>
        <circle cx="8" cy="-5" r="3" fill="#333"/>
        <path d="M -10 8 Q 0 15 10 8" stroke="#333" stroke-width="2" fill="none"/>
      </g>
    </svg>`
  },
  
  coloredCloud: {
    id: 'coloredCloud',
    name: '彩色云朵',
    icon: '☁️',
    category: 'nature',
    defaultSize: 70,
    svg: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10,10)">
        <ellipse cx="25" cy="35" rx="20" ry="18" fill="#E0F2FE"/>
        <ellipse cx="45" cy="30" rx="25" ry="22" fill="#BAE6FD"/>
        <ellipse cx="70" cy="35" rx="22" ry="20" fill="#7DD3FC"/>
        <ellipse cx="50" cy="40" rx="30" ry="20" fill="#38BDF8"/>
      </g>
    </svg>`
  },
  
  coloredRainbow: {
    id: 'coloredRainbow',
    name: '彩虹',
    icon: '🌈',
    category: 'nature',
    defaultSize: 100,
    svg: `<svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0,-20)">
        <path d="M 20 80 Q 75 20, 130 80" stroke="#FF0000" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 28, 130 80" stroke="#FFA500" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 36, 130 80" stroke="#FFFF00" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 44, 130 80" stroke="#00FF00" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 52, 130 80" stroke="#0000FF" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 60, 130 80" stroke="#4B0082" stroke-width="8" fill="none"/>
        <path d="M 20 80 Q 75 68, 130 80" stroke="#8B00FF" stroke-width="8" fill="none"/>
      </g>
    </svg>`
  },
  
  coloredTree: {
    id: 'coloredTree',
    name: '彩色树',
    icon: '🌳',
    category: 'nature',
    defaultSize: 90,
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="45" y="80" width="10" height="30" fill="#8B4513"/>
      <circle cx="50" cy="40" r="25" fill="#228B22"/>
      <circle cx="35" cy="50" r="20" fill="#32CD32"/>
      <circle cx="65" cy="50" r="20" fill="#32CD32"/>
      <circle cx="50" cy="60" r="22" fill="#00FF00"/>
      <circle cx="40" cy="35" r="4" fill="#FF69B4"/>
      <circle cx="60" cy="40" r="4" fill="#FFD700"/>
      <circle cx="45" cy="55" r="4" fill="#FF1493"/>
    </svg>`
  },
  
  // ANIMAL STICKERS
  coloredButterfly: {
    id: 'coloredButterfly',
    name: '彩色蝴蝶',
    icon: '🦋',
    category: 'animals',
    defaultSize: 60,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="3" ry="15" fill="#333"/>
        <!-- Wings -->
        <ellipse cx="-15" cy="-5" rx="20" ry="15" fill="#FF69B4" transform="rotate(-20 -15 -5)"/>
        <ellipse cx="15" cy="-5" rx="20" ry="15" fill="#FF69B4" transform="rotate(20 15 -5)"/>
        <ellipse cx="-12" cy="8" rx="15" ry="12" fill="#FFD700" transform="rotate(20 -12 8)"/>
        <ellipse cx="12" cy="8" rx="15" ry="12" fill="#FFD700" transform="rotate(-20 12 8)"/>
        <!-- Decorations -->
        <circle cx="-18" cy="-5" r="3" fill="#FFF"/>
        <circle cx="18" cy="-5" r="3" fill="#FFF"/>
        <circle cx="-10" cy="8" r="2" fill="#FF1493"/>
        <circle cx="10" cy="8" r="2" fill="#FF1493"/>
      </g>
    </svg>`
  },
  
  coloredBird: {
    id: 'coloredBird',
    name: '彩色小鸟',
    icon: '🦜',
    category: 'animals',
    defaultSize: 50,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="20" ry="15" fill="#00CED1"/>
        <!-- Head -->
        <circle cx="-10" cy="-8" r="10" fill="#00BFFF"/>
        <!-- Wing -->
        <ellipse cx="8" cy="0" rx="15" ry="10" fill="#1E90FF" transform="rotate(15 8 0)"/>
        <!-- Eye -->
        <circle cx="-12" cy="-8" r="2" fill="#000"/>
        <circle cx="-12" cy="-8" r="1" fill="#FFF"/>
        <!-- Beak -->
        <polygon points="-20,-8 -25,-6 -20,-4" fill="#FFA500"/>
        <!-- Tail -->
        <polygon points="15,0 25,5 25,-5" fill="#4169E1"/>
      </g>
    </svg>`
  },
  
  coloredFish: {
    id: 'coloredFish',
    name: '彩色小鱼',
    icon: '🐠',
    category: 'animals',
    defaultSize: 55,
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,40)">
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="25" ry="15" fill="#FF6347"/>
        <!-- Tail -->
        <polygon points="20,0 30,-10 30,10" fill="#FF4500"/>
        <!-- Eye -->
        <circle cx="-10" cy="-3" r="4" fill="#FFF"/>
        <circle cx="-10" cy="-3" r="2" fill="#000"/>
        <!-- Stripes -->
        <rect x="-5" y="-10" width="3" height="20" fill="#FFD700"/>
        <rect x="5" y="-10" width="3" height="20" fill="#FFD700"/>
        <!-- Fins -->
        <ellipse cx="0" cy="-12" rx="8" ry="5" fill="#FFA500"/>
        <ellipse cx="0" cy="12" rx="8" ry="5" fill="#FFA500"/>
      </g>
    </svg>`
  },
  
  coloredBee: {
    id: 'coloredBee',
    name: '彩色蜜蜂',
    icon: '🐝',
    category: 'animals',
    defaultSize: 45,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Wings -->
        <ellipse cx="-10" cy="-8" rx="12" ry="8" fill="#E0F2FE" opacity="0.8"/>
        <ellipse cx="10" cy="-8" rx="12" ry="8" fill="#E0F2FE" opacity="0.8"/>
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="15" ry="12" fill="#FFD700"/>
        <!-- Stripes -->
        <rect x="-15" y="-3" width="30" height="3" fill="#000"/>
        <rect x="-15" y="3" width="30" height="3" fill="#000"/>
        <!-- Head -->
        <circle cx="-12" cy="0" r="6" fill="#000"/>
        <!-- Eyes -->
        <circle cx="-13" cy="-2" r="1.5" fill="#FFF"/>
        <circle cx="-13" cy="2" r="1.5" fill="#FFF"/>
      </g>
    </svg>`
  },
  
  coloredLadybug: {
    id: 'coloredLadybug',
    name: '瓢虫',
    icon: '🐞',
    category: 'animals',
    defaultSize: 40,
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,40)">
        <!-- Body -->
        <ellipse cx="0" cy="0" rx="18" ry="15" fill="#FF0000"/>
        <!-- Head -->
        <ellipse cx="-15" cy="0" rx="8" ry="10" fill="#000"/>
        <!-- Middle line -->
        <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#000" stroke-width="2"/>
        <!-- Spots -->
        <circle cx="-5" cy="-5" r="3" fill="#000"/>
        <circle cx="5" cy="-6" r="3" fill="#000"/>
        <circle cx="-3" cy="5" r="3" fill="#000"/>
        <circle cx="7" cy="4" r="3" fill="#000"/>
      </g>
    </svg>`
  },
  
  // OBJECT STICKERS
  coloredBalloon: {
    id: 'coloredBalloon',
    name: '彩色气球',
    icon: '🎈',
    category: 'objects',
    defaultSize: 65,
    svg: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,40)">
        <!-- String -->
        <line x1="0" y1="20" x2="0" y2="45" stroke="#666" stroke-width="1"/>
        <!-- Balloon -->
        <ellipse cx="0" cy="0" rx="20" ry="25" fill="#FF1493"/>
        <!-- Highlight -->
        <ellipse cx="-5" cy="-10" rx="8" ry="10" fill="#FF69B4" opacity="0.6"/>
      </g>
    </svg>`
  },
  
  coloredStar: {
    id: 'coloredStar',
    name: '彩色星星',
    icon: '⭐',
    category: 'objects',
    defaultSize: 50,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <polygon points="0,-20 6,-6 20,-5 10,5 12,20 0,12 -12,20 -10,5 -20,-5 -6,-6" 
                 fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
        <polygon points="0,-12 3,-3 10,-2 5,3 6,10 0,6 -6,10 -5,3 -10,-2 -3,-3" 
                 fill="#FFF" opacity="0.6"/>
      </g>
    </svg>`
  },
  
  coloredHeart: {
    id: 'coloredHeart',
    name: '彩色爱心',
    icon: '❤️',
    category: 'objects',
    defaultSize: 45,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,45)">
        <path d="M 0,10 C -10,-5 -30,-5 -30,10 C -30,25 0,40 0,40 C 0,40 30,25 30,10 C 30,-5 10,-5 0,10 Z" 
              fill="#FF1493"/>
        <ellipse cx="-10" cy="5" rx="8" ry="10" fill="#FF69B4" opacity="0.5"/>
      </g>
    </svg>`
  },
  
  coloredGift: {
    id: 'coloredGift',
    name: '礼物盒',
    icon: '🎁',
    category: 'objects',
    defaultSize: 55,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Box -->
        <rect x="-25" y="-5" width="50" height="35" fill="#FF69B4"/>
        <!-- Lid -->
        <rect x="-30" y="-10" width="60" height="10" fill="#FF1493"/>
        <!-- Ribbon vertical -->
        <rect x="-5" y="-20" width="10" height="50" fill="#FFD700"/>
        <!-- Ribbon horizontal -->
        <rect x="-30" y="-10" width="60" height="10" fill="#FFD700"/>
        <!-- Bow -->
        <ellipse cx="-8" cy="-15" rx="10" ry="8" fill="#FFA500" transform="rotate(-30 -8 -15)"/>
        <ellipse cx="8" cy="-15" rx="10" ry="8" fill="#FFA500" transform="rotate(30 8 -15)"/>
        <circle cx="0" cy="-15" r="5" fill="#FFD700"/>
      </g>
    </svg>`
  },
  
  coloredCake: {
    id: 'coloredCake',
    name: '生日蛋糕',
    icon: '🎂',
    category: 'objects',
    defaultSize: 60,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <!-- Bottom layer -->
        <rect x="-30" y="5" width="60" height="20" fill="#8B4513"/>
        <!-- Middle layer -->
        <rect x="-25" y="-10" width="50" height="20" fill="#FFF"/>
        <!-- Top layer -->
        <rect x="-20" y="-20" width="40" height="15" fill="#FFB6C1"/>
        <!-- Cream -->
        <path d="M -20,-20 Q -15,-25 -10,-20 Q -5,-25 0,-20 Q 5,-25 10,-20 Q 15,-25 20,-20" 
              fill="#FFF" stroke="none"/>
        <!-- Candles -->
        <rect x="-10" y="-30" width="3" height="10" fill="#FF69B4"/>
        <rect x="0" y="-30" width="3" height="10" fill="#00CED1"/>
        <rect x="10" y="-30" width="3" height="10" fill="#90EE90"/>
        <!-- Flames -->
        <ellipse cx="-8.5" cy="-33" rx="2" ry="3" fill="#FFA500"/>
        <ellipse cx="1.5" cy="-33" rx="2" ry="3" fill="#FFA500"/>
        <ellipse cx="11.5" cy="-33" rx="2" ry="3" fill="#FFA500"/>
      </g>
    </svg>`
  },
  
  // DECORATIONS
  coloredSparkle: {
    id: 'coloredSparkle',
    name: '闪光',
    icon: '✨',
    category: 'decorations',
    defaultSize: 35,
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,40)">
        <g transform="rotate(0)">
          <polygon points="0,-15 3,-3 15,0 3,3 0,15 -3,3 -15,0 -3,-3" fill="#FFD700"/>
        </g>
        <g transform="rotate(45)">
          <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#FFA500" opacity="0.8"/>
        </g>
      </g>
    </svg>`
  },
  
  coloredMoon: {
    id: 'coloredMoon',
    name: '月亮',
    icon: '🌙',
    category: 'decorations',
    defaultSize: 50,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        <path d="M -10,-20 Q -20,0 -10,20 Q 10,15 15,0 Q 10,-15 -10,-20" fill="#FFD700"/>
        <circle cx="-5" cy="-5" r="3" fill="#FFA500" opacity="0.6"/>
        <circle cx="-3" cy="8" r="2" fill="#FFA500" opacity="0.5"/>
      </g>
    </svg>`
  },
  
  coloredDiamond: {
    id: 'coloredDiamond',
    name: '钻石',
    icon: '💎',
    category: 'decorations',
    defaultSize: 40,
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,40)">
        <polygon points="-15,-10 -10,-15 10,-15 15,-10 10,20 0,25 -10,20" fill="#00CED1"/>
        <polygon points="-10,-15 0,-18 10,-15 0,-10" fill="#E0FFFF"/>
        <polygon points="-15,-10 -10,-15 -10,15 -15,10" fill="#4682B4"/>
        <polygon points="15,-10 10,-15 10,15 15,10" fill="#4682B4"/>
      </g>
    </svg>`
  },
  
  coloredNote: {
    id: 'coloredNote',
    name: '音符',
    icon: '🎵',
    category: 'decorations',
    defaultSize: 45,
    svg: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(40,50)">
        <ellipse cx="-10" cy="15" rx="8" ry="6" fill="#FF1493"/>
        <ellipse cx="10" cy="20" rx="8" ry="6" fill="#00CED1"/>
        <rect x="-3" y="-25" width="3" height="40" fill="#333"/>
        <rect x="17" y="-20" width="3" height="40" fill="#333"/>
        <rect x="-3" y="-25" width="23" height="5" fill="#333"/>
      </g>
    </svg>`
  },
  
  coloredSnowflake: {
    id: 'coloredSnowflake',
    name: '雪花',
    icon: '❄️',
    category: 'decorations',
    defaultSize: 50,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)" stroke="#00BFFF" stroke-width="3" fill="none">
        <line x1="0" y1="-25" x2="0" y2="25"/>
        <line x1="-22" y1="-12" x2="22" y2="12"/>
        <line x1="-22" y1="12" x2="22" y2="-12"/>
        <circle cx="0" cy="-25" r="3" fill="#00BFFF"/>
        <circle cx="0" cy="25" r="3" fill="#00BFFF"/>
        <circle cx="-22" cy="-12" r="3" fill="#00BFFF"/>
        <circle cx="22" cy="12" r="3" fill="#00BFFF"/>
        <circle cx="-22" cy="12" r="3" fill="#00BFFF"/>
        <circle cx="22" cy="-12" r="3" fill="#00BFFF"/>
        <circle cx="0" cy="0" r="5" fill="#E0FFFF"/>
      </g>
    </svg>`
  }
};

export const STICKER_CATEGORIES = [
  { id: 'nature', name: '自然', icon: '🌿' },
  { id: 'animals', name: '动物', icon: '🦋' },
  { id: 'objects', name: '物品', icon: '🎁' },
  { id: 'decorations', name: '装饰', icon: '✨' }
];