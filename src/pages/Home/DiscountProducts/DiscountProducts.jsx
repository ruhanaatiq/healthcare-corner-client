import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const DiscountProducts = ({ products = [] }) => {  // Default to an empty array if products is undefined
  // Filter the products to get only those with a discount
const discountedProducts = Array.isArray(products) ? products.filter(product => product.discount > 0) : [];

  // Handle case where no products are available
  if (discountedProducts.length === 0) {
    return <p>No discounted products available.</p>;
  }

  return (
    <div className="discount-products-section">
      <h2 className="text-2xl font-bold mb-4">Discounted Products</h2>

      <Swiper
        spaceBetween={10} // Space between each card
        slidesPerView={'auto'} // Display as many cards as possible in view
        loop={true} // Infinite loop
        grabCursor={true} // Allow dragging the slider
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {discountedProducts.map((product) => (
          <SwiperSlide key={product._id} className="swiper-slide">
            <div className="card w-64 bg-white p-4 m-2 shadow-lg rounded-lg">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/150'}  // Fallback image if no imageUrl
                alt={product.name || 'Product Image'} // Add alt text for better accessibility
                className="w-full h-32 object-cover rounded-md"
              />
              <h3 className="text-xl text-red-600 font-bold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Price: <span className="line-through">${product.price}</span> ${product.discountedPrice || product.price}
              </p>
              <p className="text-green-500 font-semibold">Discount: {product.discount}% OFF</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DiscountProducts;
