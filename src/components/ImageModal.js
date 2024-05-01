import React, { useState } from 'react';

const ImageModal = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const hasPrevImage = currentIndex !== 0;
  const hasNextImage = currentIndex !== images.length - 1;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="relative max-w-2xl max-h-full overflow-hidden">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute top-0 right-0 m-0 text-white hover:text-gray-300 bg-red-700 rounded-full z-51"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {hasPrevImage && (
          <button
            className="absolute top-1/2 left-0 m-1 text-white hover:text-gray-300 bg-green-500"
            onClick={handlePrevImage}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {hasNextImage && (
          <button
            className="absolute top-1/2 right-0 m-1  text-white hover:text-gray-300 bg-green-500"
            onClick={handleNextImage}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;