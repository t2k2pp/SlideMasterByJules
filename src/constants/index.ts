import { TextLayer, ImageLayer, ShapeLayer } from '../types';

// Using Omit to create types for default properties, excluding base properties and IDs.
type DefaultTextProps = Omit<TextLayer, 'id' | 'type' | 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'zIndex'>;
type DefaultImageProps = Omit<ImageLayer, 'id' | 'type' | 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'zIndex' | 'src'>;
type DefaultShapeProps = Omit<ShapeLayer, 'id' | 'type' | 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'zIndex'>;

interface DefaultLayerProps {
  text: DefaultTextProps;
  image: DefaultImageProps;
  shape: DefaultShapeProps;
}

export const DEFAULT_LAYER_PROPS: DefaultLayerProps = {
  text: {
    content: 'New Text',
    fontSize: 58,
    textAlign: 'center' as const,
    color: '#000000',
    fontFamily: 'Arial',
  },
  image: {
    objectFit: 'contain' as const,
    prompt: 'A beautiful, high-quality image',
  },
  shape: {
    shapeType: 'rectangle' as const,
    fillColor: '#6366f1',
    strokeColor: '#4f46e5',
    strokeWidth: 2,
  },
};
