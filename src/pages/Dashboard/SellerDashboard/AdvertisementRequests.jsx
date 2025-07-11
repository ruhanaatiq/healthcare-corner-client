
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxiosSecure';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdvertisementRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [requests, setRequests] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchRequests = () => {
    axiosSecure.get(`/advertisements?sellerEmail=${user.email}`)
      .then(res => setRequests(res.data));
  };

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user]);

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
      setUploading(false);
      toast.error('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl || !description) return toast.error('Missing fields');

    try {
      const res = await axiosSecure.post('/advertisements', {
        sellerEmail: user.email,
        imageUrl,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      if (res.data.insertedId) {
        toast.success('Request submitted');
        setDescription('');
        setImageUrl('');
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ask for Advertisement</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input type="file" onChange={handleImageUpload} className="file-input w-full" />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        ></textarea>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {requests.map(req => (
          <div key={req._id} className="card shadow p-4">
            <img src={req.imageUrl} alt="Ad" className="w-full h-48 object-cover rounded mb-2" />
            <p>{req.description}</p>
            <span className={`badge ${req.status === 'approved' ? 'badge-success' : 'badge-warning'} mt-2`}>
              {req.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvertisementRequests;
