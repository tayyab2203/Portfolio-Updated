'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LogIn, AlertCircle, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        redirect: 'manual',
        body: JSON.stringify(formData),
      });

      if (response.status === 302 || response.type === 'opaqueredirect') {
        window.location.href = '/admin';
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      window.location.href = '/admin';
      return;
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const showDefaultCreds = process.env.NODE_ENV !== 'production';

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-ebony/90 border border-dusty-olive/30 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-camel/20 flex items-center justify-center mb-4">
              <Shield className="text-camel" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-khaki-beige-900 font-comfortaa mb-1">
              Admin Portal
            </h1>
            <p className="text-sm text-dry-sage-600">
              Secure access to your portfolio management
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-khaki-beige-900 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-dry-sage-600">
                  <User size={18} />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-dusty-olive/40 bg-charcoal-brown/70 px-10 py-2.5 text-sm text-khaki-beige-900 placeholder-dry-sage-600 focus:border-camel focus:outline-none focus:ring-2 focus:ring-camel/40"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-khaki-beige-900 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-dry-sage-600">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-dusty-olive/40 bg-charcoal-brown/70 px-10 py-2.5 text-sm text-khaki-beige-900 placeholder-dry-sage-600 focus:border-camel focus:outline-none focus:ring-2 focus:ring-camel/40"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-camel px-4 py-2.5 text-sm font-semibold text-ebony shadow-md transition hover:bg-toffee-brown disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-4 w-4 rounded-full border-2 border-ebony border-t-transparent"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          {showDefaultCreds && (
            <div className="mt-6 border-t border-dusty-olive/20 pt-4">
              <p className="text-[11px] text-dry-sage-600 text-center leading-relaxed">
                <span className="text-dry-sage-400">Default credentials:</span>{' '}
                <span className="font-mono text-camel">admin</span> /{' '}
                <span className="font-mono text-camel">admin123</span>
                <br />
                <span className="mt-1 block text-[11px] text-red-400/80">
                  Change these and set <code className="font-mono">ADMIN_USERNAME</code>,{' '}
                  <code className="font-mono">ADMIN_PASSWORD_HASH</code> in production.
                </span>
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-dry-sage-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <span>Secure connection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
