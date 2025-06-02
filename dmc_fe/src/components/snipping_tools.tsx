// components/SnippingTool.jsx
import React, { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas'; // Or html-to-image

const SnippingTool = () => {
  const containerRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState(''); // For user feedback

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsSelecting(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setSelectionRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    setMessage(''); // Clear previous message
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const newX = Math.min(startPoint.x, currentX);
    const newY = Math.min(startPoint.y, currentY);
    const newWidth = Math.abs(startPoint.x - currentX);
    const newHeight = Math.abs(startPoint.y - currentY);

    setSelectionRect({ x: newX, y: newY, width: newWidth, height: newHeight });
  }, [isSelecting, startPoint]);

  const handleMouseUp = useCallback(async () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const { x, y, width, height } = selectionRect;

    if (width > 0 && height > 0) {
      // Ensure the user agent supports the Clipboard API
      if (!navigator.clipboard || !navigator.clipboard.write) {
        setMessage('Clipboard API not supported by your browser.');
        console.warn('Clipboard API not supported.');
        setSelectionRect({ x: 0, y: 0, width: 0, height: 0 }); // Reset selection display
        return;
      }

      try {
        const canvas = await html2canvas(document.body, {
          x: x + window.scrollX, // Adjust for current scroll position
          y: y + window.scrollY,
          width: width,
          height: height,
          // scrollX: -window.scrollX, // html2canvas automatically handles these if x/y are provided
          // scrollY: -window.scrollY, // relative to the current viewport
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const item = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
              setMessage('Image copied to clipboard!');
            } catch (clipboardError) {
              console.error('Failed to copy image to clipboard:', clipboardError);
              setMessage('Failed to copy image to clipboard. Please check browser permissions.');
            }
          } else {
            setMessage('Failed to create image blob.');
          }
        }, 'image/png'); // Specify PNG format for the blob

      } catch (error) {
        console.error("Error capturing area:", error);
        setMessage("Error capturing area. Check console for details.");
      }
    }
    setSelectionRect({ x: 0, y: 0, width: 0, height: 0 }); // Reset selection display
  }, [isSelecting, selectionRect]);

  // Attach event listeners to the entire document for global selection
  React.useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <h1>Welcome to the Snipping Tool Demo!</h1>
        <p>Drag your mouse to select an area to capture.</p>
        <div style={{ background: '#f0f0f0', padding: '20px', margin: '20px', border: '1px dashed #ccc' }}>
          <h3>This is some content to capture</h3>
          <p>You can select any part of the screen.</p>
          <img src="/next.svg" alt="Next.js Logo" width={80} height={80} />
          <div style={{ width: '150px', height: '100px', background: 'lightgreen', marginTop: '10px' }}>
            Another element
          </div>
        </div>
        <p>Try pasting the image into an image editor (like Paint, Photoshop, or a Google Doc) after selecting an area.</p>
      </div>

      {isSelecting && (
        <div
          style={{
            position: 'fixed',
            left: selectionRect.x,
            top: selectionRect.y,
            width: selectionRect.width,
            height: selectionRect.height,
            border: '2px dashed blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}

      {message && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1001,
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SnippingTool;