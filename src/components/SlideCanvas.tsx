import React, { useRef, useState, useLayoutEffect } from 'react';
import { Slide, Layer } from '../types';
import { LayerRenderer } from './LayerRenderer';
import Moveable from 'react-moveable';

interface SlideCanvasProps {
  slide: Slide;
  selectedLayerIds: string[];
  onSelectLayer: (ids: string[]) => void;
  onUpdateLayer: (layerId: string, newProperties: Partial<Layer>) => void;
}

export const SlideCanvas = ({ slide, selectedLayerIds, onSelectLayer, onUpdateLayer }: SlideCanvasProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const targetEl = document.getElementById(selectedLayerIds[0]) || null;
    setTarget(targetEl);
  }, [selectedLayerIds]);

  useLayoutEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const { width, height } = canvasContainerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const handleLayerClick = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onSelectLayer([layerId]);
  };

  const handleCanvasClick = () => {
    onSelectLayer([]);
  };

  const canvasStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    padding: '20px',
    overflow: 'hidden',
  };

  const slideWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: '16 / 9',
    position: 'relative',
  };

  const slideStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: slide.background,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <main style={canvasStyle} onClick={handleCanvasClick}>
      <div style={slideWrapperStyle} ref={canvasContainerRef}>
        {containerSize.width > 0 && (
          <div style={slideStyle}>
            {slide.layers
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((layer) => {
                const layerStyle: React.CSSProperties = {
                  position: 'absolute',
                  left: `${(layer.x / 100) * containerSize.width}px`,
                  top: `${(layer.y / 100) * containerSize.height}px`,
                  width: `${(layer.width / 100) * containerSize.width}px`,
                  height: `${(layer.height / 100) * containerSize.height}px`,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                  zIndex: layer.zIndex,
                };
                return (
                  <div
                    key={layer.id}
                    id={layer.id}
                    style={layerStyle}
                    onClick={(e) => handleLayerClick(e, layer.id)}
                  >
                    <LayerRenderer layer={layer} />
                  </div>
                );
              })}
          </div>
        )}
        <Moveable
          target={target}
          draggable={true}
          resizable={true}
          rotatable={true}
          onDrag={e => {
            e.target.style.transform = e.transform;
          }}
          onDragEnd={e => {
            if (e.lastEvent) {
              const newX = (e.lastEvent.beforeTranslate[0] / containerSize.width) * 100;
              const newY = (e.lastEvent.beforeTranslate[1] / containerSize.height) * 100;
              onUpdateLayer(e.target.id, { x: newX, y: newY });
            }
          }}
          onResize={e => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
          }}
          onResizeEnd={e => {
            if (e.lastEvent) {
              const newWidth = (e.lastEvent.width / containerSize.width) * 100;
              const newHeight = (e.lastEvent.height / containerSize.height) * 100;
              onUpdateLayer(e.target.id, { width: newWidth, height: newHeight });
            }
          }}
          onRotate={e => {
            e.target.style.transform = e.drag.transform;
          }}
          onRotateEnd={e => {
            if (e.lastEvent) {
              onUpdateLayer(e.target.id, { rotation: e.lastEvent.rotation });
            }
          }}
        />
      </div>
    </main>
  );
};
