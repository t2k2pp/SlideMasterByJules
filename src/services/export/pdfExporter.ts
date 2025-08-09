import jsPDF from 'jspdf';
import { Presentation, TextLayer, ShapeLayer, ImageLayer } from '../../types';

// A4 dimensions in points (pt)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

const exportToPdf = async (presentation: Presentation) => {
  // Assuming landscape orientation for slides
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const slideWidth = doc.internal.pageSize.getWidth();
  const slideHeight = doc.internal.pageSize.getHeight();

  for (const [index, slide] of presentation.slides.entries()) {
    if (index > 0) {
      doc.addPage();
    }

    // Set slide background color
    // jsPDF doesn't directly support setting page background, so we draw a rect
    doc.setFillColor(slide.background || '#FFFFFF');
    doc.rect(0, 0, slideWidth, slideHeight, 'F');

    for (const layer of slide.layers.sort((a, b) => a.zIndex - b.zIndex)) {
      const x = (layer.x / 100) * slideWidth;
      const y = (layer.y / 100) * slideHeight;
      const w = (layer.width / 100) * slideWidth;
      const h = (layer.height / 100) * slideHeight;

      doc.setOpacity(layer.opacity);

      // Note: Rotation is complex in jsPDF and requires matrix transforms.
      // Skipping for this initial implementation.

      if (layer.type === 'text') {
        const textLayer = layer as TextLayer;
        doc.setTextColor(textLayer.color);
        // Font size conversion from pixels (approx) to points
        const fontSizePt = textLayer.fontSize * 0.75;
        doc.setFontSize(fontSizePt);
        doc.text(textLayer.content, x, y + h / 2, { align: textLayer.textAlign, maxWidth: w });
      } else if (layer.type === 'shape') {
        const shapeLayer = layer as ShapeLayer;
        doc.setFillColor(shapeLayer.fillColor);
        doc.setDrawColor(shapeLayer.strokeColor);
        doc.setLineWidth(shapeLayer.strokeWidth);

        if (shapeLayer.shapeType === 'rectangle') {
          doc.rect(x, y, w, h, 'FD'); // Fill and Stroke
        } else if (shapeLayer.shapeType === 'circle') {
          doc.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 'FD');
        }
      } else if (layer.type === 'image') {
        const imageLayer = layer as ImageLayer;
        if (imageLayer.src) {
          try {
            // Assuming JPEG for now. PNG support is also possible.
            doc.addImage(imageLayer.src, 'JPEG', x, y, w, h);
          } catch (e) {
            console.error("Error adding image to PDF:", e);
            // Draw a placeholder if image fails
            doc.setDrawColor("#FF0000");
            doc.rect(x, y, w, h, 'S');
            doc.text("Image Error", x + 5, y + 15);
          }
        }
      }
    }
  }

  doc.save(`${presentation.title || 'presentation'}.pdf`);
};

export default exportToPdf;
