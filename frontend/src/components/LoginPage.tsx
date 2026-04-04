import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import { FadeIn } from './animations';

interface FormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        apiEndpoint(ENDPOINTS.token),
        {
          username: formData.username,
          password: formData.password
        }
      );

      localStorage.setItem('token', response.data.access);
      navigate('/');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-32 flex-1 flex items-center justify-center px-8">
        <FadeIn>
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Welcome Back</span>
              <h1 className="serif-heading text-4xl font-bold text-primary mb-4">Sign In</h1>
              <p className="text-on-surface-variant">Access your account to manage orders and favorites.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error-container text-error p-4 text-sm"
                >
                  {error}
                </motion.div>
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" className="text-secondary border-b border-secondary/30 pb-0.5 hover:border-secondary transition-colors">
                  Create one
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-on-surface-variant opacity-60">
                Demo: admin / admin123
              </p>
            </div>
          </div>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
