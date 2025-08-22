import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  text = 'Cargando...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen ? 'loading-container fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
