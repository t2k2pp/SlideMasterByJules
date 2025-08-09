import React from 'react';

export const LayerEditor = () => {
  const editorStyle: React.CSSProperties = {
    width: '250px',
    backgroundColor: '#f7f7f7',
    borderLeft: '1px solid #ddd',
    padding: '10px',
  };

  return (
    <aside style={editorStyle}>
      <h3>Layer Properties</h3>
      <p>Select a layer to see its properties.</p>
    </aside>
  );
};
