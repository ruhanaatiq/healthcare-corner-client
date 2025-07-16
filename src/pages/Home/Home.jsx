import React, { useEffect, useState } from 'react';
import Banner from './Banner/Banner';
import CategoryCardContainer from './Category/CategoryCardContainer'; // assuming this renders multiple cards
import DiscountProducts from './DiscountProducts/DiscountProducts';
import useAxios from '../../hooks/useAxios'; // adjust path as needed
import FeaturedHealthTips from './FeaturedHealthtips';
import WhyUs from './WhyUs';

const Home = () => {
  const axios = useAxios();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    axios.get('/api/medicines')
      .then((res) => {
        console.log('Fetched medicines:', res.data);
        setMedicines(res.data);
      })
      .catch((err) => console.error('Error fetching medicines:', err));
  }, [axios]);

  return (
    <div>
      <Banner />
      <CategoryCardContainer />
      <DiscountProducts products={medicines} /> {/* ✅ now products is passed */}
      <FeaturedHealthTips></FeaturedHealthTips>
      <WhyUs></WhyUs>
    </div>
  );
};

export default Home;
