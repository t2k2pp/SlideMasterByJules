import PptxGenJS from "pptxgenjs";
import { Presentation, TextLayer, ShapeLayer, ImageLayer } from '../../types';

const exportToPptx = async (presentation: Presentation) => {
  const pptx = new PptxGenJS();

  // Set layout based on presentation settings
  const aspectRatio = presentation.globalSettings.aspectRatio || '16:9';
  if (aspectRatio === '16:9') {
    pptx.layout = 'LAYOUT_16x9';
  } else if (aspectRatio === '4:3') {
    pptx.layout = 'LAYOUT_4x3';
  } // Add other layouts if needed

  for (const slideData of presentation.slides) {
    const slide = pptx.addSlide();

    // Set background color
    slide.background = { color: slideData.background.replace('#', '') };

    for (const layer of slideData.layers.sort((a, b) => a.zIndex - b.zIndex)) {
      const options: any = {
        x: `${layer.x}%`,
        y: `${layer.y}%`,
        w: `${layer.width}%`,
        h: `${layer.height}%`,
      };

      if (layer.type === 'text') {
        const textLayer = layer as TextLayer;
        const textOptions = {
          ...options,
          color: textLayer.color.replace('#', ''),
          fontFace: textLayer.fontFamily,
          fontSize: textLayer.fontSize * 0.75, // Convert to points (approx)
          align: textLayer.textAlign,
          valign: 'middle',
        };
        slide.addText(textLayer.content, textOptions);
      } else if (layer.type === 'shape') {
        const shapeLayer = layer as ShapeLayer;
        const shapeType = pptx.shapes[shapeLayer.shapeType.toUpperCase() as keyof typeof pptx.shapes] || pptx.shapes.RECTANGLE;
        const shapeOptions = {
          ...options,
          fill: { color: shapeLayer.fillColor.replace('#', '') },
          line: { color: shapeLayer.strokeColor.replace('#', ''), width: shapeLayer.strokeWidth },
        };
        slide.addShape(shapeType, shapeOptions);
      } else if (layer.type === 'image') {
        const imageLayer = layer as ImageLayer;
        if (imageLayer.src) {
            // PptxGenJS requires the base64 data without the mime type prefix
            const base64Data = imageLayer.src.split(',')[1];
            slide.addImage({ data: `base64,${base64Data}`, ...options });
        }
      }
    }
  }

  await pptx.writeFile({ fileName: `${presentation.title || 'presentation'}.pptx` });
};

export default exportToPptx;
