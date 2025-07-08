import React from 'react';
import Banner from './Banner/Banner';
import CategoryCard from './Category/CategoryCard';
import DiscountProducts from './DiscountProducts/DiscountProducts';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <CategoryCard></CategoryCard>
            <DiscountProducts></DiscountProducts>
   </div>
    );
};

export default Home;