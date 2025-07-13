import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxiosSecure';
import axios from 'axios';

const AddMedicineModal = ({ onClose, refetch }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Upload image to imgbb
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`, formData);
      setImageUrl(res.data.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    const price = parseFloat(data.price);
    const discount = parseFloat(data.discount || 0);
    const discountedPrice = price - (price * discount / 100);

    const medicine = {
      name: data.name,
      genericName: data.genericName || '',
      description: data.description || '',
      price,
      discount,
      discountedPrice,
      quantity: parseInt(data.quantity),
      category: data.category,
      company: data.company,
      massUnit: data.massUnit,
      imageUrl,
      sellerEmail: user?.email,
      isBanner: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await axiosSecure.post('/api/medicines', medicine);
      if (res.data.insertedId) {
        toast.success('Medicine added');
        reset();
        setImageUrl('');
        onClose();
        refetch && refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add medicine');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
        <button className="absolute top-3 right-4 text-xl" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4 text-red-700">Add New Medicine</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('name', { required: 'Name is required' })} className="input input-bordered" placeholder="Medicine Name" />
            <input {...register('genericName')} className="input input-bordered" placeholder="Generic Name" />

            <input {...register('price', { required: 'Price is required' })} type="number" className="input input-bordered" placeholder="Price" />
            <input {...register('quantity', { required: 'Quantity is required' })} type="number" className="input input-bordered" placeholder="Quantity" />

            <input {...register('company', { required: 'Company is required' })} className="input input-bordered" placeholder="Company" />

            <select {...register('massUnit', { required: 'Mass unit is required' })} className="select select-bordered">
              <option value="">Select Unit</option>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
            </select>

            <select {...register('category', { required: 'Category is required' })} className="select select-bordered">
              <option value="">Select Category</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Ointment">Ointment</option>
            </select>

            <input {...register('discount')} type="number" className="input input-bordered" placeholder="Discount (%)" />
          </div>

          <textarea {...register('description')} className="textarea textarea-bordered w-full" placeholder="Short Description" />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={uploading}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
