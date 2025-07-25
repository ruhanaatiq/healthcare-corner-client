import React, { useState, useContext } from 'react';
import useAxios from '../../hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { CartContext } from '../../contexts/CartContext';
import MedicineModal from '../Home/Category/MedicineModal';
import toast from 'react-hot-toast';

const Shop = () => {
  const axios = useAxios();
  const { dispatch } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Fetch categories
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/categories');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ✅ Fetch medicines (by category)
  const {
    data: medicines = [],
    isLoading: loadingMedicines,
    error: medicinesError,
  } = useQuery({
    queryKey: ['medicines', selectedCategory],
    queryFn: async () => {
      const url =
        selectedCategory === 'all'
          ? '/api/medicines'
          : `/api/medicines/category/${selectedCategory}`;
      const res = await axios.get(url);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
  });

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  const handleAddToCart = (medicine) => {
    dispatch({ type: 'ADD', payload: medicine });
    toast.success(`${medicine.name} added to cart`);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedicine(null);
  };

  // ✅ Loading / Error Handling
  if (loadingCategories || loadingMedicines) {
    return <p className="text-center text-red-700 py-10">Loading medicines...</p>;
  }

  if (categoriesError || medicinesError) {
    return <p className="text-center text-red-700 py-10">Error loading data</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Shop Medicines</h2>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2 text-red-700">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category.categoryName)}
            className={`btn ${
              selectedCategory === category.categoryName ? 'btn-primary' : 'btn-outline'
            }`}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      {/* Medicine Table */}
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-white text-red-600">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-red-600">
          {medicines.map((medicine) => (
            <tr key={medicine._id}>
              <td className="border px-4 py-2">
                <img
                  src={medicine.imageUrl}
                  alt={medicine.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="border px-4 py-2 text-white">{medicine.name}</td>
              <td className="border px-4 py-2 text-white">${medicine.price}</td>
              <td className="border px-4 py-2">
                <button
                  className="btn btn-info mr-2"
                  onClick={() => handleView(medicine)}
                >
                  👁
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleAddToCart(medicine)}
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Medicine Modal */}
      {modalOpen && selectedMedicine && (
        <MedicineModal medicine={selectedMedicine} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Shop;
