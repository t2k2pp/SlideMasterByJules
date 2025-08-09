import { Layer, LayerType, TextLayer, ImageLayer, ShapeLayer } from '../types';
import { DEFAULT_LAYER_PROPS } from '../constants';
import { LayoutTemplate } from '../constants/layoutTemplates';

// This defines the shape of a single part of a layout template, e.g., the 'title' part.
type LayerTemplate = LayoutTemplate[string];

/**
 * Creates a new layer object with safe defaults.
 * @param layerType The type of layer to create ('text', 'image', 'shape').
 * @param template The layout object defining position and size.
 * @param content Optional content (e.g., text for a text layer, or an image src).
 * @param zIndex The stacking order of the layer.
 * @returns A fully formed Layer object.
 */
export const createLayer = (
  layerType: LayerType,
  template: Partial<LayerTemplate>, // Allow partial templates
  content?: string,
  zIndex: number = 0
): Layer => {

  // 1. Define base properties with fallbacks, as per the design document's warning.
  const baseLayer = {
    id: `${layerType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x: template.x || 10,
    y: template.y || 10,
    width: template.width || 30,
    height: template.height || 10,
    rotation: 0,
    opacity: 1,
    zIndex,
  };

  // 2. Add type-specific properties safely, accessing defaults individually.
  //    DO NOT use the spread operator on the main DEFAULT_LAYER_PROPS object.
  if (layerType === 'text') {
    return {
      ...baseLayer,
      type: 'text',
      content: content || DEFAULT_LAYER_PROPS.text.content,
      fontSize: template.fontSize || DEFAULT_LAYER_PROPS.text.fontSize,
      textAlign: template.textAlign || DEFAULT_LAYER_PROPS.text.textAlign,
      color: DEFAULT_LAYER_PROPS.text.color,
      fontFamily: DEFAULT_LAYER_PROPS.text.fontFamily,
    } as TextLayer;
  }

  if (layerType === 'image') {
    return {
      ...baseLayer,
      type: 'image',
      src: content || '', // For images, content can be the src
      objectFit: DEFAULT_LAYER_PROPS.image.objectFit,
      prompt: DEFAULT_LAYER_PROPS.image.prompt,
    } as ImageLayer;
  }

  if (layerType === 'shape') {
    return {
      ...baseLayer,
      type: 'shape',
      shapeType: DEFAULT_LAYER_PROPS.shape.shapeType,
      fillColor: DEFAULT_LAYER_PROPS.shape.fillColor,
      strokeColor: DEFAULT_LAYER_PROPS.shape.strokeColor,
      strokeWidth: DEFAULT_LAYER_PROPS.shape.strokeWidth,
    } as ShapeLayer;
  }

  // This should not be reachable if layerType is correctly typed, but it's a good safeguard.
  throw new Error(`Unknown layer type: ${layerType}`);
};
