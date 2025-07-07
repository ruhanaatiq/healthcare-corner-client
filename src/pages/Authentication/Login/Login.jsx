import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    // ✅ Save user to MongoDB
    const saveUserToDB = async (user) => {
        try {
            await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    name: user.displayName || 'Anonymous',
                    photoURL: user.photoURL || '',
                }),
            });
        } catch (error) {
            console.error('Failed to save user to DB:', error);
        }
    };

    const onSubmit = (data) => {
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                saveUserToDB(user); // 💾 Save user to DB
                navigate(from);
            })
            .catch(error => {
                console.error('Login error:', error);
            });
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
