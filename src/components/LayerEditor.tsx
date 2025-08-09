import React from 'react';
import { Presentation, Layer, TextLayer, ImageLayer } from '../types';
import { DEFAULT_LAYER_PROPS } from '../constants';

interface LayerEditorProps {
  presentation: Presentation;
  selectedLayerIds: string[];
  onUpdateLayer: (layerId: string, newProperties: Partial<Layer>) => void;
}

export const LayerEditor = ({ presentation, selectedLayerIds, onUpdateLayer }: LayerEditorProps) => {
  const selectedLayerId = selectedLayerIds[0];

  const selectedLayer: Layer | null = React.useMemo(() => {
    if (!selectedLayerId) return null;
    for (const slide of presentation.slides) {
      const foundLayer = slide.layers.find(l => l.id === selectedLayerId);
      if (foundLayer) return foundLayer;
    }
    return null;
  }, [selectedLayerId, presentation.slides]);

  const handlePropertyChange = (prop: keyof Layer, value: any) => {
    if (selectedLayer) {
      onUpdateLayer(selectedLayer.id, { [prop]: value });
    }
  };

  const handleFilterChange = (filterName: keyof ImageLayer['filters'], value: number) => {
    if (selectedLayer && selectedLayer.type === 'image') {
      const newFilters = { ...selectedLayer.filters, [filterName]: value };
      onUpdateLayer(selectedLayer.id, { filters: newFilters });
    }
  };

  const renderTextControls = () => {
    if (!selectedLayer || selectedLayer.type !== 'text') return null;
    const layer = selectedLayer as TextLayer;
    // ... (text controls implementation from before)
    return <div>Text Controls Placeholder</div>
  };

  const renderImageControls = () => {
    if (!selectedLayer || selectedLayer.type !== 'image') return null;
    const layer = selectedLayer as ImageLayer;
    const filters = layer.filters || DEFAULT_LAYER_PROPS.image.filters;

    return (
      <div>
        <h4>Image Filters</h4>
        <div>
          <label>Brightness</label>
          <input type="range" min="0" max="2" step="0.1" value={filters.brightness} onChange={e => handleFilterChange('brightness', parseFloat(e.target.value))} />
        </div>
        <div>
          <label>Contrast</label>
          <input type="range" min="0" max="2" step="0.1" value={filters.contrast} onChange={e => handleFilterChange('contrast', parseFloat(e.target.value))} />
        </div>
        <div>
          <label>Saturation</label>
          <input type="range" min="0" max="2" step="0.1" value={filters.saturate} onChange={e => handleFilterChange('saturate', parseFloat(e.target.value))} />
        </div>
      </div>
    );
  }

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
          <p>ID: {selectedLayer.id.substring(0, 10)}...</p>
          <p>Type: {selectedLayer.type}</p>
        </div>
      )}
      {renderTextControls()}
      {renderImageControls()}
    </aside>
  );
};
