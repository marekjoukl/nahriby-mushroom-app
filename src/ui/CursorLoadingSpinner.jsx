import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const CursorLoadingSpinner = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Update cursor position on mouse move
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        top: cursorPos.y - 15,
        left: cursorPos.x + 15,
      }}
    >
      <FiLoader className="animate-spin text-gray-400 text-2xl" />
    </div>
  );
};

export default CursorLoadingSpinner;
