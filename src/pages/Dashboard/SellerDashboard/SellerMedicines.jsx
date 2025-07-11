import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AddMedicineModal from './AddMedicineModal'; // You’ll create this next

const SellerMedicines = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/medicines?sellerEmail=${user.email}`)
        .then((res) => setMedicines(res.data))
        .catch((err) => console.error('Failed to fetch seller medicines:', err));
    }
  }, [user, axiosSecure]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Medicines</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Add Medicine
        </button>
      </div>

      {/* Medicine Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med._id} className="border-b hover:bg-gray-100">
                <td className="p-3">
                  <img
                    src={med.imageUrl || 'https://via.placeholder.com/50'}
                    alt={med.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{med.name}</td>
                <td className="p-3">${med.price}</td>
                <td className="p-3">{med.discount || 0}%</td>
                <td className="p-3">{med.quantity}</td>
                <td className="p-3">{med.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medicine Modal */}
      {showModal && <AddMedicineModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SellerMedicines;
