export interface LayoutTemplate {
  [key: string]: {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export const layoutTemplates: Record<string, LayoutTemplate> = {
  title_slide: {
    title: { x: 10, y: 30, width: 80, height: 20, fontSize: 72, textAlign: 'center' },
    subtitle: { x: 10, y: 55, width: 80, height: 15, fontSize: 36, textAlign: 'center' },
  },
  title_and_content: {
    title: { x: 5, y: 5, width: 90, height: 15, fontSize: 48, textAlign: 'left' },
    content: { x: 5, y: 25, width: 90, height: 70, fontSize: 24, textAlign: 'left' },
  },
  image_right_text_left: {
    text: { x: 5, y: 15, width: 40, height: 70, fontSize: 24, textAlign: 'left' },
    image: { x: 50, y: 10, width: 45, height: 80 },
  },
  image_left_text_right: {
    image: { x: 5, y: 10, width: 45, height: 80 },
    text: { x: 55, y: 15, width: 40, height: 70, fontSize: 24, textAlign: 'left' },
  },
  image_top_text_bottom: {
    image: { x: 10, y: 5, width: 80, height: 55 },
    text: { x: 10, y: 65, width: 80, height: 30, fontSize: 24, textAlign: 'left' },
  },
};
