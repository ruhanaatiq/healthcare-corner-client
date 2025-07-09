import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../../hooks/useAxios';
import { CartContext } from '../../contexts/CartContext';
import MedicineModal from '../Home/Category/MedicineModal';

const Shop = () => {
  const axios = useAxios();
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { dispatch } = useContext(CartContext);

  useEffect(() => {
    axios.get('/api/medicines')
      .then(res => setMedicines(res.data))
      .catch(err => console.error("Error fetching medicines:", err));
  }, [axios]);

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  const handleAddToCart = (medicine) => {
    dispatch({ type: 'ADD', payload: medicine });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedicine(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Medicines</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-white text-red-600">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(medicine => (
            <tr key={medicine._id}>
              <td className="border px-4 py-2">
                <img src={medicine.imageUrl} alt={medicine.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="border px-4 py-2">{medicine.name}</td>
              <td className="border px-4 py-2">${medicine.price}</td>
              <td className="border px-4 py-2">
                <button className="btn btn-info mr-2" onClick={() => handleView(medicine)}>👁</button>
                <button className="btn btn-success" onClick={() => handleAddToCart(medicine)}>Select</button>
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
