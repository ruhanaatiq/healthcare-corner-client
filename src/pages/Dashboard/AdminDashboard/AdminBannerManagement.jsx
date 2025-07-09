import React, { useState, useEffect } from 'react';
import axios from '../../../hooks/useAxios';

const AdminBannerManagement = () => {
  const [medicines, setMedicines] = useState([]);

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('api/medicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Toggle banner status
  const toggleBannerStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/medicines/${id}/toggle-banner`);
      setMedicines(prevMedicines =>
        prevMedicines.map(medicine =>
          medicine._id === id ? { ...medicine, isBanner: !currentStatus } : medicine
        )
      );
    } catch (error) {
      console.error('Error toggling banner status:', error);
    }
  };

  return (
    <div>
      <h1>Admin Banner Management</h1>
      <table>
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Is Banner</th>
            <th>Toggle Banner</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(medicine => (
            <tr key={medicine._id}>
              <td>{medicine.name}</td>
              <td>{medicine.isBanner ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggleBannerStatus(medicine._id, medicine.isBanner)}>
                  {medicine.isBanner ? 'Remove from Banner' : 'Add to Banner'}
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
