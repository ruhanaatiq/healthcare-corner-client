import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios'; // Adjust path as needed
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const DiscountProducts = () => {
  const axios = useAxios();

  // ✅ Fetch all products/medicines
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const res = await axios.get('/api/medicines');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const discountedProducts = products.filter((product) => product.discount > 0);
  const enableLoop = discountedProducts.length > 3;

  if (isLoading) return <p className="text-center py-10">Loading discounted products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">Failed to load products.</p>;

  if (discountedProducts.length === 0) {
    return <p className="text-center text-gray-500">No discounted products available at the moment.</p>;
  }

  return (
    <div className="discount-products-section py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-red-700">🔥 Discounted Products</h2>

      <Swiper
        spaceBetween={10}
        grabCursor={true}
        loop={enableLoop}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {discountedProducts.map((product) => (
          <SwiperSlide key={product._id}>
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
