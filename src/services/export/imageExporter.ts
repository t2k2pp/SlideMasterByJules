import { toPng } from 'html-to-image';

/**
 * Exports a given HTML DOM node to a PNG image file.
 * @param node The HTMLElement to be converted to an image.
 * @param fileName The desired name of the downloaded file.
 */
export const exportNodeToPng = async (node: HTMLElement, fileName: string) => {
  try {
    const dataUrl = await toPng(node, {
      cacheBust: true, // Avoid using cached images
      quality: 0.95,
      pixelRatio: 2, // Export at 2x resolution for better quality
    });

    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();

  } catch (error) {
    console.error('Failed to export node to PNG', error);
    alert('Could not export image. See console for details.');
  }
};
