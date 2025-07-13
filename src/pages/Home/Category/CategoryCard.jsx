import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  if (!category || !category.categoryName || !category._id) {
    console.log("Invalid category:", category); // for debugging
    return (
      <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">
        Category data is unavailable
      </div>
    );
  }

  return (
    <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">
      <img 
        src={category.categoryImage || 'https://via.placeholder.com/150'} 
        alt={category.categoryName} 
        className="w-full h-32 object-cover rounded-md" 
      />
      <h3 className="text-xl font-bold mt-2 text-red-600">{category.categoryName}</h3>
      <p className="text-sm text-gray-600">Medicines: {category.medicineCount || 0}</p>
     <Link
  to={`/shop?category=${encodeURIComponent(category.categoryName)}`}
  className="mt-4 text-blue-500 hover:text-blue-700 inline-block"
>
  View Medicines
</Link>
    </div>
  );
};

export default CategoryCard;
