import React from 'react';
import { Layer, TextLayer, ShapeLayer, ImageLayer } from '../types';
import { DEFAULT_LAYER_PROPS } from '../constants';

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
            fontWeight: textLayer.bold ? 'bold' : 'normal',
            fontStyle: textLayer.italic ? 'italic' : 'normal',
            textDecoration: textLayer.underline ? 'underline' : 'none',
            letterSpacing: `${textLayer.letterSpacing || 0}px`,
            lineHeight: textLayer.lineHeight || 1.2,
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
        const imageLayer = layer as ImageLayer;
        const filters = imageLayer.filters || DEFAULT_LAYER_PROPS.image.filters;
        const filterString = `
          brightness(${filters.brightness})
          contrast(${filters.contrast})
          saturate(${filters.saturate})
          grayscale(${filters.grayscale})
          sepia(${filters.sepia})
        `.trim();

        return (
          <img
            src={imageLayer.src}
            alt={imageLayer.prompt || 'slide image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: imageLayer.objectFit,
              filter: filterString,
            }}
          />
        );
      default:
        return null;
    }
  };

  return <>{layerContent()}</>;
};
