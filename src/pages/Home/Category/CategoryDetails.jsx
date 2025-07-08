import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MedicineModal from './MedicineModal';

const CategoryDetails = () => {
  const { categoryId } = useParams();  // Use the categoryId from the URL
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch medicines based on category
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`/api/medicines/category/${categoryId}`); // Adjust route as needed
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [categoryId]);

  const handleAddToCart = (medicine) => {
    // Implement the logic to add the medicine to the cart
    console.log('Medicine added to cart:', medicine);
  };

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedicine(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Medicines in Category</h2>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Medicine Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.length > 0 ? (
            medicines.map(medicine => (
              <tr key={medicine._id}>
                <td className="border px-4 py-2">
                  <img src={medicine.imageUrl} alt={medicine.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-4 py-2">{medicine.name}</td>
                <td className="border px-4 py-2">${medicine.price}</td>
                <td className="border px-4 py-2">
                  <button 
                    className="mr-2 text-blue-500"
                    onClick={() => handleViewMedicine(medicine)}
                  >
                    View
                  </button>
                  <button 
                    className="text-green-500"
                    onClick={() => handleAddToCart(medicine)}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">No medicines available in this category.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && <MedicineModal medicine={selectedMedicine} closeModal={closeModal} />}
    </div>
  );
};

export default CategoryDetails;
