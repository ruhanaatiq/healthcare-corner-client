import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  if (!category || !category.name || !category._id) {
    console.log("Invalid category:", category); // 👈 Add this for debugging
    return (
      <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">
        Category data is unavailable
      </div>
    );
  }

  return (
    <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">
      <img 
        src={category.imageUrl || 'https://via.placeholder.com/150'} 
        alt={category.name} 
        className="w-full h-32 object-cover rounded-md text-red-400" 
      />
      <h3 className="text-xl font-bold mt-2 text-red-400">{category.name}</h3>
      <p className="text-sm text-gray-600">Medicines: {category.medicineCount || 0}</p>
      <Link to={`/category/${category._id}`} className="mt-4 text-blue-500 hover:text-blue-700">
        View Medicines
      </Link>
    </div>
  );
};

export default CategoryCard;
