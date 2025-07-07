import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxiosSecure';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser,updateUserProfile } = useAuth(); // removed updateUserProfile
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

                // update userinfo in the database
                const userInfo = {
                    email: data.email,
                    role: 'user', // default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);

                // update user profile in firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('profile name pic updated');
                        navigate(from);
                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                console.error(error);
            })
    }

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
              {...register('name', { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}

            {/* Profile Image */}
            <label className="label">Profile Picture</label>
            <input type="file" onChange={handleImageUpload} className="input" />

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500">Password must be 6 characters or longer</p>
            )}

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
