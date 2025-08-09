import React from 'react';
import { Slide } from '../types';

interface SlideNavigatorProps {
  slides: Slide[];
  currentSlideIndex: number;
}

export const SlideNavigator = ({ slides, currentSlideIndex }: SlideNavigatorProps) => {
  const navStyle: React.CSSProperties = {
    width: '240px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6',
    padding: '10px',
    overflowY: 'auto',
  };

  return (
    <nav style={navStyle}>
      {slides.map((slide, index) => {
        const isSelected = index === currentSlideIndex;
        const slidePreviewStyle: React.CSSProperties = {
          border: isSelected ? '2px solid #4F46E5' : '1px solid #ced4da',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '10px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#e9ecef' : '#fff',
          textAlign: 'left',
        };

        return (
          <div key={slide.id} style={slidePreviewStyle}>
            <span style={{color: '#6c757d', fontSize: '0.8rem'}}>Slide {index + 1}</span>
            <p style={{margin: '5px 0 0', fontWeight: 500, color: '#212529'}}>{slide.title || 'Untitled Slide'}</p>
          </div>
        );
      })}
    </nav>
  );
};
