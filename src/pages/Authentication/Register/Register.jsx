import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth'; // Import your custom useAuth hook
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxiosSecure';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useAuth(); // Make sure updateUserProfile is defined in useAuth
  const [profilePic, setProfilePic] = useState('');
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

   const onSubmit = data => {
        console.log(data);

        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);

                // Update user info in the database
                const userInfo = {
                    email: data.email,
                    role: 'user', // default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                };

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);

                // Update user profile in firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                };
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('Profile name and pic updated');
                        navigate(from);
                    })
                    .catch(error => {
                        console.log('Profile update error:', error);
                    });
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
    };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
      console.log('✅ Image uploaded:', res.data.data.url);
    } catch (err) {
      console.error('❌ Image upload failed:', err);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="input"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            {/* Profile Image */}
            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
            />

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <div><a className="link link-hover">Forgot password?</a></div>
            <button className="btn btn-primary text-black mt-4">Register</button>
          </fieldset>
          <p><small>Already have an account? <Link className="btn btn-link" to="/login">Login</Link></small></p>
        </form>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
