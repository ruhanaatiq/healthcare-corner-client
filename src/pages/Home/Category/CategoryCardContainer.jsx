import React from 'react';
import useAxios from '../../../hooks/useAxios';
import CategoryCard from './CategoryCard';
import { useQuery } from '@tanstack/react-query';

const CategoryCardContainer = () => {
  const axios = useAxios();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  if (isLoading) return <p className="text-center py-10">Loading categories...</p>;
  if (error) return <p className="text-center text-red-600 py-10">Failed to load categories.</p>;

  return (
    <div className="flex flex-wrap justify-center">
      {categories.length > 0 ? (
        categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))
      ) : (
        <p className="text-gray-500">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryCardContainer;
