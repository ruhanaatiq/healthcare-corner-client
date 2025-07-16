import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  // ✅ Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/categories');
      return res.data;
    }
  });

  // ✅ Add or update category
  const addOrUpdateCategory = useMutation({
    mutationFn: async (data) => {
      if (editId) {
        return axiosSecure.patch(`/api/categories/${editId}`, data);
      }
      return axiosSecure.post('/api/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success(editId ? 'Category updated' : 'Category added');
      reset(); // Clear the form
      setEditId(null);
    }
  });

  // ✅ Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted');
    }
  });

  // ✅ Submit handler
  const onSubmit = (data) => {
    if (!data.categoryName || !data.categoryImage) {
      toast.error('All fields are required');
      return;
    }
    addOrUpdateCategory.mutate(data);
  };

  // ✅ Edit handler
  const handleEdit = (category) => {
    setEditId(category._id);
    setValue('categoryName', category.categoryName);
    setValue('categoryImage', category.categoryImage);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-red-600 font-bold mb-4">Manage Categories</h2>

      {/* Add/Edit Category Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Category Name"
          {...register('categoryName', { required: 'Name is required' })}
          className="input input-bordered w-full"
        />
        {errors.categoryName && (
          <p className="text-red-500 text-sm">{errors.categoryName.message}</p>
        )}

        <input
          type="text"
          placeholder="Image URL"
          {...register('categoryImage', { required: 'Image URL is required' })}
          className="input input-bordered w-full"
        />
        {errors.categoryImage && (
          <p className="text-red-500 text-sm">{errors.categoryImage.message}</p>
        )}

        <button type="submit" className="btn btn-primary w-full">
          {editId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-red-600 shadow rounded">
          <thead>
            <tr className="text-white">
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="text-center">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="4" className="text-center text-white">No categories</td></tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat._id} className="bg-white text-red-500">
                  <td>{index + 1}</td>
                  <td><img src={cat.categoryImage} alt={cat.categoryName} className="w-12 h-12 rounded text-red-500" /></td>
<td>{cat.categoryName || '⚠️ Missing name'}</td>                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => deleteCategory.mutate(cat._id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
