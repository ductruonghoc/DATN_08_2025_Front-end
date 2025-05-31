import React, { useState } from 'react';

const Component = () => {
  // Array of image URLs for the slider
  const images = [
    'https://placehold.co/400x300/FF5733/FFFFFF?text=Image+1',
    'https://placehold.co/400x300/33FF57/FFFFFF?text=Image+2',
    'https://placehold.co/400x300/5733FF/FFFFFF?text=Image+3',
    'https://placehold.co/400x300/FF33A1/FFFFFF?text=Image+4',
    'https://placehold.co/400x300/33A1FF/FFFFFF?text=Image+5',
  ];

  // State to manage the current active image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle moving to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to handle moving to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center space-y-6">
        {/* Title for the component */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Image Display</h1>

        {/* Vertical Image Slider Section */}
        <div className="flex items-center space-y-4 w-full">
          {/* Previous button */}
          <button
            onClick={prevImage}
            className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Image display area */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg border-2 border-gray-200">
            <img
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              // Fallback for image loading errors
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/400x300/CCCCCC/666666?text=Image+Error';
              }}
            />
          </div>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Read-only Text Area Section */}
        <div className="w-full">
          <label htmlFor="readOnlyText" className="block text-sm font-medium text-gray-700 mb-2">
            Description:
          </label>
          <textarea
            id="readOnlyText"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            rows={5} // Approximately 100px height for default font size
            readOnly
            value={`This is a read-only description for Image ${currentImageIndex + 1}. You can display any relevant text here. This text area is fixed at approximately 100px height.`}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Component;