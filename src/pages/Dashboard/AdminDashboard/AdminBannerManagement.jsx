import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
const AdminBannerManagement = () => {
  const [medicines, setMedicines] = useState([]);
const axiosSecure = useAxiosSecure();
    useEffect(() => {
    axiosSecure.get('/api/medicines')
      .then(res => setMedicines(res.data))
      .catch(err => console.error('Error fetching medicines:', err));
  }, [axiosSecure]);

const toggleBannerStatus = async (id, currentStatus) => {
  try {
    await axiosSecure.patch(`/api/medicines/${id}/banner`, {
      isBanner: !currentStatus,
    });

    setMedicines(prev =>
      prev.map(med =>
        med._id === id ? { ...med, isBanner: !currentStatus } : med
      )
    );

    toast.success(`Successfully ${!currentStatus ? 'added to' : 'removed from'} banner`);
  } catch (err) {
    console.error('Toggle failed:', err);
    toast.error('Failed to toggle banner status');
  }
};
  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Advertise Banner Management</h1>
      <table className="table w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-red-500">
            <th>Image</th>
            <th>Medicine Name</th>
            <th>Description</th>
            <th>Seller Email</th>
            <th>Banner Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(med => (
            <tr key={med._id}>
              <td><img src={med.imageUrl} alt={med.name} className="w-16 h-16 rounded text-red-500" /></td>
              <td className='text-red-500'>{med.name}</td>
              <td className="max-w-sm truncate text-red-500">{med.description}</td>
              <td className='text-red-500'>{med.sellerEmail}</td>
              <td>
                <span className={`px-2 py-1 rounded text-sm ${med.isBanner ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {med.isBanner ? 'In Banner' : 'Not in Banner'}
                </span>
              </td>
              <td>
                <button
                  onClick={() => toggleBannerStatus(med._id, med.isBanner)}
                  className={`btn btn-sm ${med.isBanner ? 'btn-error' : 'btn-primary'}`}
                >
                  {med.isBanner ? 'Remove from Banner' : 'Add to Banner'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBannerManagement;
