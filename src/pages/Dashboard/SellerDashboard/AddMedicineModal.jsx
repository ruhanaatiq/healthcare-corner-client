import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxiosSecure';

const AddMedicineModal = ({ isOpen, onClose, refetch }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);
    setUploading(true);
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`, formData);
      setImageUrl(res.data.data.url);
      setUploading(false);
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Image upload failed');
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
  if (!imageUrl) return toast.error('Please upload an image');

  const price = parseFloat(data.price);
  const discount = parseFloat(data.discount || 0);
  const discountedPrice = price - (price * discount / 100);

  const newMedicine = {
    name: data.name,
    genericName: data.genericName,
    description: data.description,
    price,
    quantity: parseInt(data.quantity),
    category: data.category,
    company: data.company,
    massUnit: data.massUnit,
    discount,
    discountedPrice: isNaN(discountedPrice) ? price : discountedPrice,
    imageUrl,
    sellerEmail: user.email,
    isBanner: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const res = await axiosSecure.post('/medicines', newMedicine);
    if (res.data.insertedId) {
      toast.success('Medicine added');
      reset();
      setImageUrl('');
      onClose();
      refetch && refetch(); // refresh table if passed
    }
  } catch (err) {
    toast.error('Failed to add medicine');
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
        <button className="absolute right-4 top-3 text-xl" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('name', { required: true })} className="input input-bordered w-full" placeholder="Medicine Name" />
            <input {...register('genericName')} className="input input-bordered w-full" placeholder="Generic Name" />

            <input {...register('price', { required: true })} type="number" className="input input-bordered w-full" placeholder="Price" />
            <input {...register('quantity', { required: true })} type="number" className="input input-bordered w-full" placeholder="Quantity" />

            <input {...register('company')} className="input input-bordered w-full" placeholder="Company" />
            <select {...register('massUnit', { required: true })} className="select select-bordered w-full">
              <option value="mg">Mg</option>
              <option value="ml">Ml</option>
            </select>

            <select {...register('category', { required: true })} className="select select-bordered w-full">
              <option value="">Select Category</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Ointment">Ointment</option>
              {/* or fetch categories dynamically */}
            </select>

            <input {...register('discount')} type="number" className="input input-bordered w-full" placeholder="Discount (%)" />
          </div>

          <textarea {...register('description')} className="textarea textarea-bordered w-full" placeholder="Short Description" />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={uploading}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
