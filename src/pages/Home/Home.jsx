import React, { useEffect, useState } from 'react';
import Banner from './Banner/Banner';
import CategoryCardContainer from './Category/CategoryCardContainer';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import FeaturedHealthTips from './FeaturedHealthtips';
import WhyUs from './WhyUs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, loading: authLoading } = useAuth(); // wait for auth
  const axiosSecure = useAxiosSecure();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (authLoading) return;

      try {
        const res = await axiosSecure.get('/api/medicines');
        setMedicines(res.data);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [authLoading, axiosSecure]);

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
