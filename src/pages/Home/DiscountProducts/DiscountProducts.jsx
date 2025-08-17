import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// If you use axios + a custom hook, import it and replace fetch() calls.
const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function normalize(p) {
  const price = Number(p?.price) || 0;
  // discount may be "10" or "10%"
  const rawDiscount = typeof p?.discount === 'string'
    ? Number(p.discount.replace('%', ''))
    : Number(p?.discount);
  const discount = Number.isFinite(rawDiscount) ? rawDiscount : 0;

  const computedDiscounted =
    typeof p?.discountedPrice === 'number'
      ? p.discountedPrice
      : (discount > 0 ? Number((price * (100 - discount) / 100).toFixed(2)) : price);

  return {
    ...p,
    discount,
    price,
    computedDiscounted,
  };
}

const DiscountProducts = ({ products = [] }) => {
  const [serverItems, setServerItems] = useState(null);   // null = not loaded, [] = loaded empty
  const [error, setError] = useState('');

  // If parent passes products, use them; otherwise fetch from /api/discounted
  const useServer = !products || products.length === 0;

  useEffect(() => {
    let ignore = false;
    if (!useServer) return;

    (async () => {
      try {
        setError('');
        const res = await fetch('/discounted'); // or `${import.meta.env.VITE_API_BASE_URL}/api/discounted`
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Expect docs with isDiscounted: true; still normalize for safety
        const normalized = (data || [])
          .filter(item => item?.isDiscounted === true || (Number(item?.discount) || 0) > 0)
          .map(normalize);

        if (!ignore) setServerItems(normalized);
      } catch (e) {
        if (!ignore) {
          setError('Failed to load discounted products.');
          setServerItems([]);
        }
      }
    })();

    return () => { ignore = true; };
  }, [useServer]);

  const list = useMemo(() => {
    if (useServer) return serverItems ?? null; // null while loading
    // Client-side filter if parent handed all products
    return (products || [])
      .filter(p => p?.isDiscounted === true || (Number(p?.discount) || 0) > 0)
      .map(normalize);
  }, [useServer, serverItems, products]);

  if (list === null) {
    return <p className="text-center text-gray-500">Loading discounted products…</p>;
  }
  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }
  if (list.length === 0) {
    return <p className="text-center text-gray-500">No discounted products available.</p>;
  }

  const enableLoop = list.length > 3;

  return (
    <div className="discount-products-section py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-red-700">🔥 Discounted Products</h2>

      <Swiper
        spaceBetween={10}
        grabCursor
        loop={enableLoop}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        watchOverflow
      >
        {list.map((product) => (
          <SwiperSlide key={product._id || product.name}>
            <div className="card w-64 bg-white p-4 m-2 shadow-lg rounded-lg">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name ? `${product.name} image` : 'Product image'}
                className="w-full h-32 object-cover rounded-md"
                loading="lazy"
              />
              <h3 className="text-xl text-red-600 font-bold mt-2 line-clamp-2">
                {product.name || 'Unnamed Product'}
              </h3>

              <p className="text-sm text-gray-600">
                Price:{' '}
                <span className="line-through">
                  {currency.format(product.price ?? 0)}
                </span>{' '}
                <span className="text-black">
                  {currency.format(product.computedDiscounted ?? product.price ?? 0)}
                </span>
              </p>

              {product.discount > 0 && (
                <p className="text-green-600 font-semibold">
                  Discount: {product.discount}% OFF
                </p>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DiscountProducts;
