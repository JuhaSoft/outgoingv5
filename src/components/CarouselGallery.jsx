// CarouselGallery.js
import React from 'react';
import Slider from 'react-slick';

const CarouselGallery = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative">
      <h3 className="text-sm font-semibold mb-2">Carousel Gallery</h3>
      <Slider {...settings} className="carousel">
        {images.map((imageUrl, index) => (
          <div key={index} className="px-2">
            <img
              src={imageUrl}
              alt={`Gallery Image ${index}`}
              className="w-full h-auto rounded-md"
            />
          </div>
        ))}
      </Slider>
      <div className="slick-dots absolute bottom-0 left-0 right-0 flex justify-center mb-4">
        {/* Dots akan dihasilkan oleh react-slick */}
      </div>
    </div>
  );
};

export default CarouselGallery;