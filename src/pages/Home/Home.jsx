import React, { useEffect, useState } from 'react';
import Banner from './Banner/Banner';
import CategoryCardContainer from './Category/CategoryCardContainer';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import FeaturedHealthTips from './FeaturedHealthtips';
import WhyUs from './WhyUs';
import useAxios from '../../hooks/useAxios';        // 👈 use public axios
import toast from 'react-hot-toast';

const Home = () => {
  const axios = useAxios();                          // 👈 no secure axios here
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get('/medicines');   // 👈 NOT /api/medicines
        if (!cancelled) setMedicines(res.data || []);
      } catch (err) {
        console.error(
          'Error fetching medicines:',
          err?.response?.status,
          (err?.config?.baseURL || '') + (err?.config?.url || '')
        );
        toast.error('Failed to load medicines');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [axios]);

  return (
    <div>
      <Banner />
      <CategoryCardContainer />
      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading discounted products...</p>
      ) : (
        <DiscountProducts products={medicines} />
      )}
      <FeaturedHealthTips />
      <WhyUs />
    </div>
  );
};

export default Home;
