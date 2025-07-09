import React, { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios'; // adjust path if needed
import CategoryCard from './CategoryCard';

const CategoryCardContainer = () => {
  const axios = useAxios();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        console.log('Fetched categories:', res.data); // 👈 Add this
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [axios]);

  return (
    <div className="flex flex-wrap justify-center">
      {categories.length > 0 ? (
        categories.map((category) => (
          <CategoryCard key={category._id} category={category} /> // ✅ Pass prop as `category`
        ))
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};

export default CategoryCardContainer;
