import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { redirectByRole } from '../../../utils/redirectByRole';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const from = location.state?.from || '/';

  // Save user to DB (optional: update last login time)
 // Save user to DB (creates if not exists)
const saveUserToDB = async (user) => {
  try {
    await axiosSecure.post('/users', {
      email: user.email,
      name: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      last_log_in: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to save user to DB:', error.response?.data || error.message);
  }
};


  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const user = result.user;

      await saveUserToDB(user);
      await redirectByRole(user.email, axiosSecure, navigate);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}

          {/* Password */}
          <label className="label mt-4">Password</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            className="input input-bordered w-full"
            placeholder="Password"
          />
          {errors.password?.type === 'required' && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === 'minLength' && (
            <p className="text-red-500">Password must be at least 6 characters</p>
          )}

          {/* Forgot Password */}
          <div className="mt-2 mb-4">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm">
          New to this website?{' '}
          <Link state={{ from }} className="link" to="/auth/register">
            Register
          </Link>
        </p>

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
