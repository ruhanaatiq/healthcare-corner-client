import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // If category is undefined or missing required fields, display a fallback message
  if (!category) {
    return <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">Category data is unavailable</div>;
  }

  return (
    <div className="card w-64 bg-gray-100 p-4 m-2 shadow-lg rounded-lg">
      <img 
        src={category.imageUrl || 'https://via.placeholder.com/150'} 
        alt={category.name || 'No category name'} 
        className="w-full h-32 object-cover rounded-md" 
      />
      <h3 className="text-xl font-bold mt-2">{category.name || 'Unknown Category'}</h3>
      {/* Assuming medicineCount is calculated dynamically */}
      <p className="text-sm text-gray-600">Medicines: {category.medicineCount || 0}</p>
      <Link to={`/category/${category._id}`} className="mt-4 text-blue-500 hover:text-blue-700">
        View Medicines
      </Link>
    </div>
  );
};

export default CategoryCard;
