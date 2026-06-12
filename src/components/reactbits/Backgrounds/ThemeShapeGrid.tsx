'use client';

import { useEffect, useState } from 'react';
import ShapeGrid from '@/components/reactbits/Backgrounds/ShapeGrid';

export default function ThemeShapeGrid() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => {
      const saved = localStorage.getItem('theme');
      const dark = saved === 'dark' || (saved === 'light' ? false : document.documentElement.classList.contains('dark'));
      setIsDark(dark);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <ShapeGrid
      speed={0.5}
      squareSize={40}
      direction='diagonal'
      borderColor={isDark ? '#2F293A' : '#D1C4E9'}
      hoverFillColor={isDark ? '#222' : '#EDE7F6'}
      vignetteDark='#120F17'
      vignetteLight='rgba(245, 243, 250, 0.7)'
      shape='square'
      hoverTrailAmount={0}
    />
  );
}
