import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const DiscountProducts = ({ products = [] }) => {
  const discountedProducts = products.filter(product => product.discount > 0);

  // Determine whether to enable loop
  const enableLoop = discountedProducts.length > 3; // Adjust based on your max slidesPerView

  if (discountedProducts.length === 0) {
    return <p className="text-center text-gray-500">No discounted products available.</p>;
  }

  return (
    <div className="discount-products-section py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-red-700">🔥 Discounted Products</h2>

      <Swiper
        spaceBetween={10}
        grabCursor={true}
        loop={enableLoop} // ✅ Only loop if enough slides
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
                src={product.imageUrl || 'https://via.placeholder.com/150'}
                alt={product.name || 'Product Image'}
                className="w-full h-32 object-cover rounded-md"
              />
              <h3 className="text-xl text-red-600 font-bold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Price: <span className="line-through">${product.price}</span>{' '}
                <span className="text-black">${product.discountedPrice || product.price}</span>
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
