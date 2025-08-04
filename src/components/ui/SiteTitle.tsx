'use client';

import { useEffect, useState } from 'react';

interface SiteTitleProps {
  hidden?: boolean;
}

export default function SiteTitle({ hidden = false }: SiteTitleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[4] text-5xl font-black text-center pointer-events-none transition-all duration-500 ${
        hidden ? 'opacity-0 -translate-y-[100px]' : ''
      } ${!mounted ? 'opacity-0' : 'opacity-100'}`}
      style={{
        fontFamily: "'Comic Sans MS', '华文彩云', '幼圆', cursive",
        filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.2))',
        animation: mounted ? 'bounce 2s ease-in-out infinite' : 'none'
      }}
    >
      <span className="absolute text-2xl animate-float top-[-20px] left-[-30px]">✨</span>
      <span className="text-[#FF6B6B] inline-block animate-wiggle">康</span>
      <span className="text-[#4ECDC4] inline-block animate-wiggle animation-delay-100">康</span>
      <span className="text-[#45B7D1] inline-block animate-wiggle animation-delay-200">画</span>
      <span className="text-[#FFA07A] inline-block animate-wiggle animation-delay-300">画</span>
      <span className="text-[#98D8C8] inline-block animate-wiggle animation-delay-400">机</span>
      <span className="absolute text-2xl animate-float animation-delay-1000 top-[-15px] right-[-25px]">🌈</span>
      <span className="absolute text-2xl animate-float animation-delay-2000 bottom-[-15px] left-5">⭐</span>
    </div>
  );
}