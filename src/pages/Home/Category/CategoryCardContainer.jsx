import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryCard from './CategoryCard';

const CategoryCardContainer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Adjust this route to your backend
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {categories.length > 0 ? (
        categories.map(category => (
          <CategoryCard key={category._id} category={category} />  
        ))
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};

export default CategoryCardContainer;
