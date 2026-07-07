import React from 'react';

export default function FloatingShapes() {
  return (
    <div className="floating-shapes pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      <div className="shape shape-cube" />
      <div className="shape shape-ring" />
      <div className="shape shape-sphere" />
      <div className="shape shape-pyramid" />
    </div>
  );
}
