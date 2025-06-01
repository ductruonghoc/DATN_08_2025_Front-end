import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Save } from 'lucide-react'; // Assuming you have lucide-react for icons
import { BASE_URL } from '@/src/api/base_url';

// interfaces.ts (or wherever you define your interfaces)

/**
 * Defines the structure for an image object used in the ImageDisplayComponent.
 */
export interface ImageItem {
  /**
   * A unique identifier for the image. This ID will be used to fetch the actual image URL.
   */
  id: number;
  /**
   * Alternative text for the image, crucial for accessibility and displayed when the image cannot be loaded.
   */
  alt: string;
  // You can add more properties here if your image objects will contain more data, e.g.:
  // caption?: string; // Optional caption for the image
  // category?: string; // Image category
}
// (Your fetchImageUrlById function as defined above)

// In the same file as ImageItem or a utility file
type ImageUrl = string; // Simple type alias for image URLs

// This is a placeholder function. In a real application, you would
// replace this with your actual image fetching logic (e.g., an API call).
const fetchImageUrlById = async (id: number): Promise<ImageUrl> => {
  try {
    const res = await fetch(`${BASE_URL}/pdf_process/get_img_signed_url?img_id=${id}`);
    const data = await res.json();
    if (data.success && data.data && data.data.signed_url) {
      return data.data.signed_url;
    }
    return 'https://placehold.co/400x300/CCCCCC/666666?text=Image+Error';
  } catch {
    return 'https://placehold.co/400x300/CCCCCC/666666?text=Image+Error';
  }
};

interface ImageDisplayComponentProps {
  images: ImageItem[]; // Use the ImageItem interface for the images array
}

const Component: React.FC<ImageDisplayComponentProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(''); // Explicitly type as string
  const [description, setDescription] = useState<string>(''); // Explicitly type as string

  // Effect to update image URL and description when currentImageIndex or images prop changes
  useEffect(() => {
    const loadImage = async () => {
      if (images && images.length > 0) {
        const imageId = images[currentImageIndex].id;
        const url = await fetchImageUrlById(imageId);
        setCurrentImageUrl(url);
        // You might want to fetch or set a default description based on the image ID or alt text
        setDescription(`This is a description for ${images[currentImageIndex].alt}.`);
      } else {
        setCurrentImageUrl('https://placehold.co/400x300/CCCCCC/666666?text=No+Images');
        setDescription('No images available to display.');
      }
    };
    loadImage();
  }, [currentImageIndex, images]); // Dependency array to re-run effect when these change

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

  // Toggle editing state and save description if toggling off
  const toggleEditing = () => {
    if (isEditing) {
      // Save event: send POST request
      fetch(`${BASE_URL}/pdf_process/save_and_embed_img_alt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdf_image_id: images[currentImageIndex].id,
          img_alt: description,
        }),
      }).catch((err) => {
        console.error('Network error saving image alt:', err);
      });
    }
    setIsEditing((prev) => !prev);
  };

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Image Display</h1>
          <p className="text-gray-600">No images provided to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center space-y-6">
        {/* Title for the component */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Image Display</h1>

        {/* Vertical Image Slider Section */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className='flex justify-between w-full mb-4 items-center'>
            {/* Previous button */}
            <button
              onClick={prevImage}
              className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className='font-bold'>Image {currentImageIndex + 1} / {images.length}</div>
            {/* Next button */}
            <button
              onClick={nextImage}
              className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Image display area */}
        <div className="relative w-full h-64 overflow-hidden rounded-lg border-2 border-gray-200">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={images[currentImageIndex].alt}
              className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
              // Fallback for image loading errors
              onError={(e) => {
                const target = e.target;
                if (target instanceof HTMLImageElement) {
                  target.onerror = null;
                  target.src = 'https://placehold.co/400x300/CCCCCC/666666?text=Image+Error';
                }
              }}
            />
          ) : null}
        </div>

        {/* Editable Text Area Section */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="imageDescription" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <button
              onClick={toggleEditing}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center"
              aria-label={isEditing ? "Save Notes" : "Edit Notes"}
            >
              {isEditing ? <Save size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          <textarea
            id="imageDescription"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            rows={5}
            readOnly={!isEditing}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Component;