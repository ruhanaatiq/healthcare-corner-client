import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ categoryName: '', categoryImage: '' });
  const [editId, setEditId] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/categories');
      return res.data;
    }
  });

  const addOrUpdateCategory = useMutation({
    mutationFn: async (data) => {
      if (editId) {
        return axiosSecure.patch(`/api/categories/${editId}`, data);
      }
      return axiosSecure.post('/api/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setFormData({ categoryName: '', categoryImage: '' });
      setEditId(null);
      toast.success('Category saved!');
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.categoryImage) return toast.error('All fields required');
    addOrUpdateCategory.mutate(formData);
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setFormData({ categoryName: category.categoryName, categoryImage: category.categoryImage });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

      {/* Add/Edit Category Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Category Name"
          value={formData.categoryName}
          onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.categoryImage}
          onChange={(e) => setFormData({ ...formData, categoryImage: e.target.value })}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">
          {editId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id}>
                <td>{index + 1}</td>
                <td><img src={cat.categoryImage} className="w-12 h-12 rounded" /></td>
                <td>{cat.categoryName}</td>
                <td className="flex gap-2">
                  <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-info">Edit</button>
                  <button onClick={() => deleteCategory.mutate(cat._id)} className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
