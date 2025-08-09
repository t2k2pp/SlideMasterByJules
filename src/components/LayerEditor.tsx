import React from 'react';
import { Presentation, Layer, TextLayer } from '../types';

interface LayerEditorProps {
  presentation: Presentation;
  selectedLayerIds: string[];
  onUpdateLayer: (layerId: string, newProperties: Partial<Layer>) => void;
}

export const LayerEditor = ({ presentation, selectedLayerIds, onUpdateLayer }: LayerEditorProps) => {
  const selectedLayerId = selectedLayerIds[0];

  let selectedLayer: Layer | null = null;
  if (selectedLayerId) {
    for (const slide of presentation.slides) {
      const foundLayer = slide.layers.find(l => l.id === selectedLayerId);
      if (foundLayer) {
        selectedLayer = foundLayer;
        break;
      }
    }
  }

  const handlePropertyChange = (prop: keyof Layer, value: any) => {
    if (selectedLayer) {
      onUpdateLayer(selectedLayer.id, { [prop]: value });
    }
  };

  const renderTextControls = () => {
    if (!selectedLayer || selectedLayer.type !== 'text') return null;
    const layer = selectedLayer as TextLayer;

    return (
      <div>
        <h4>Text Properties</h4>
        <div>
          <label>Font Size</label>
          <input
            type="number"
            value={layer.fontSize}
            onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Color</label>
          <input
            type="color"
            value={layer.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handlePropertyChange('bold', !layer.bold)}>
            {layer.bold ? <strong>B</strong> : 'B'}
          </button>
          <button onClick={() => handlePropertyChange('italic', !layer.italic)}>
            {layer.italic ? <em>I</em> : 'I'}
          </button>
          <button onClick={() => handlePropertyChange('underline', !layer.underline)}>
            {layer.underline ? <u>U</u> : 'U'}
          </button>
        </div>
      </div>
    );
  };

  const editorStyle: React.CSSProperties = {
    width: '250px',
    backgroundColor: '#f7f7f7',
    borderLeft: '1px solid #ddd',
    padding: '10px',
    fontFamily: 'sans-serif',
  };

  return (
    <aside style={editorStyle}>
      <h3>Properties</h3>
      <hr />
      {!selectedLayer && <p>Select a layer to see its properties.</p>}
      {selectedLayer && (
        <div>
          <p>ID: {selectedLayer.id}</p>
          <p>Type: {selectedLayer.type}</p>
          {/* Add common properties editors here */}
        </div>
      )}
      {renderTextControls()}
    </aside>
  );
};
