import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxiosSecure';
import SocialLogin from '../SocialLogin/SocialLogin';
import { redirectByRole } from '../../../utils/redirectByRole';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxios();
  const [profilePic, setProfilePic] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // 🔼 Handle image upload to imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    try {
      setUploading(true);
      const res = await axios.post(uploadUrl, formData);
      const imageUrl = res.data.data.url;
      setProfilePic(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      toast.error('Image upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  // 🧾 Submit registration form
  const onSubmit = async (data) => {
    const email = data.email.trim();

    try {
      const result = await createUser(email, data.password);
      const user = result.user;

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic || ''
      });

      const userInfo = {
        email,
        name: data.name,
        photoURL: profilePic || '',
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      await axiosSecure.post('/users', userInfo);

      toast.success('Account created successfully!');
      await redirectByRole(user.email, axiosSecure, navigate);

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.warn('Email already registered. Redirecting to login...');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        console.error('❌ Registration failed:', err);
        toast.error('Something went wrong. Try again later.');
      }
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-auto mt-10">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4">

            {/* Name */}
            <div>
              <label className="label">Your Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input input-bordered w-full"
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="label">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
              />
              {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters required' }
                })}
                className="input input-bordered w-full"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={uploading || isSubmitting}
            >
              {uploading || isSubmitting ? 'Please wait...' : 'Register'}
            </button>
          </fieldset>
        </form>

        <p className="text-center mt-4">
          <small>
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600 underline">Login</Link>
          </small>
        </p>

        <div className="divider">OR</div>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
