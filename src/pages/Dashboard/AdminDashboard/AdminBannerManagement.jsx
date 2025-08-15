import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const AdminBannerManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch medicines
  const {
    data: medicines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-medicines'],
    queryFn: async () => {
      const res = await axiosSecure.get('/medicines');
      return res.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  // ✅ Mutation for banner toggle
  const mutation = useMutation({
    mutationFn: async ({ id, currentStatus }) => {
      await axiosSecure.patch(`/medicines/${id}/banner`, {
        isBanner: !currentStatus,
      });
    },
    onSuccess: (_, { currentStatus }) => {
      toast.success(
        `Successfully ${!currentStatus ? 'added to' : 'removed from'} banner`
      );
      queryClient.invalidateQueries(['admin-medicines']); // ✅ refetch data
    },
    onError: () => {
      toast.error('Failed to toggle banner status');
    },
  });

  const handleToggleBanner = (id, currentStatus) => {
    mutation.mutate({ id, currentStatus });
  };

  // ✅ Loading or error states
  if (isLoading) {
    return <p className="text-center text-red-700 py-10">Loading medicines...</p>;
  }

  if (error) {
    return <p className="text-center text-red-700 py-10">Error loading medicines</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-red-800">Advertise Banner Management</h1>
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
          {medicines.map((med) => (
            <tr key={med._id}>
              <td>
                <img
                  src={med.imageUrl}
                  alt={med.name}
                  className="w-16 h-16 rounded"
                />
              </td>
              <td className="text-red-500">{med.name}</td>
              <td className="max-w-sm truncate text-red-500">{med.description}</td>
              <td className="text-red-500">{med.sellerEmail}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    med.isBanner
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {med.isBanner ? 'In Banner' : 'Not in Banner'}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleToggleBanner(med._id, med.isBanner)}
                  className={`btn btn-sm ${
                    med.isBanner ? 'btn-error' : 'btn-primary'
                  }`}
                  disabled={mutation.isLoading}
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
