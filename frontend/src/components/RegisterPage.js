import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                'http://localhost:8000/api/auth/register/',
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }
            );
            
            // Auto login after registration
            const loginResponse = await axios.post('http://localhost:8000/api/token/', {
                username: formData.username,
                password: formData.password
            });
            
            localStorage.setItem('token', loginResponse.data.access);
            navigate('/');
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="pt-32 flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12">
                        <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Join Us</span>
                        <h1 className="serif-heading text-4xl font-bold text-primary mb-4">Create Account</h1>
                        <p className="text-on-surface-variant">Access exclusive collections and member benefits.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-error-container text-error p-4 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary outline-none py-3 px-2 transition-colors"
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary outline-none py-3 px-2 transition-colors"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary outline-none py-3 px-2 transition-colors"
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary outline-none py-3 px-2 transition-colors"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link to="/login" className="text-secondary border-b border-secondary/30 pb-0.5 hover:border-secondary transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;
