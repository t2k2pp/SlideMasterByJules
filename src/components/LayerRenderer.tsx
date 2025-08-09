import React from 'react';
import { Layer, TextLayer, ShapeLayer, ImageLayer } from '../types';

interface LayerRendererProps {
  layer: Layer;
}

export const LayerRenderer = ({ layer }: LayerRendererProps) => {
  const layerContent = () => {
    switch (layer.type) {
      case 'text':
        const textLayer = layer as TextLayer;
        return (
          <div style={{
            fontSize: `${textLayer.fontSize}px`, // This needs to be scaled with canvas zoom
            color: textLayer.color,
            textAlign: textLayer.textAlign,
            fontFamily: textLayer.fontFamily,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {textLayer.content}
          </div>
        );
      case 'shape':
        const shapeLayer = layer as ShapeLayer;
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: shapeLayer.fillColor,
            border: `${shapeLayer.strokeWidth}px solid ${shapeLayer.strokeColor}`,
            borderRadius: shapeLayer.shapeType === 'circle' ? '50%' : '0px', // Simple example
          }} />
        );
      case 'image':
        // Placeholder for image rendering
        return <div style={{width: '100%', height: '100%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Image Layer</div>;
      default:
        return null;
    }
  };

  return <>{layerContent()}</>;
};
