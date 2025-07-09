import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminUsers from '../../../hooks/useAdminUsers';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminUsers = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const promoteToAdmin = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/users/${id}/admin`),
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  });

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table w-full">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => promoteToAdmin.mutate(user._id)}
                    className="btn btn-sm btn-info mr-2"
                  >
                    Make Admin
                  </button>
                )}
                <button
                  onClick={() => deleteUser.mutate(user._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
