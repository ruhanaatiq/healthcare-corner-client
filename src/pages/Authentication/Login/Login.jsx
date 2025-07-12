import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { redirectByRole } from '../../../utils/redirectByRole';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(); // ✅ added this
  const from = location.state?.from || '/';

  // Save user to DB (optional if you want to track login time)
  const saveUserToDB = async (user) => {
    try {
      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '',
          last_log_in: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to save user to DB:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const user = result.user;

      await saveUserToDB(user); // Optional: update last login timestamp
      await redirectByRole(user.email, axiosSecure, navigate); // ✅ Role-based redirection

    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Please Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email')}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <p className='text-red-500'>Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className='text-red-500'>Password must be at least 6 characters</p>
            )}

            <div><a className="link link-hover">Forgot password?</a></div>

            <button className="btn btn-primary text-black mt-4">Login</button>
          </fieldset>

          <p><small>New to this website? <Link state={{ from }} className="btn btn-link" to="/register">Register</Link></small></p>
        </form>

        {/* 🔐 Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
