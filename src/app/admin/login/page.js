'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LogIn, AlertCircle, Shield } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
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

      // 302 = login success; cookie is set by browser. Go to /admin explicitly (do NOT use response.url).
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div
      className="min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-black via-charcoal-brown/30 to-black relative overflow-hidden flex items-center justify-center"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-toffee-brown/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-camel/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" suppressHydrationWarning />

      <div className="relative z-10 w-full flex items-center justify-center p-4" suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
          suppressHydrationWarning
        >
          {/* Main Login Card */}
          <div className="bg-gradient-to-br from-ebony/95 via-ebony/90 to-charcoal-brown/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-dusty-olive/20 shadow-2xl relative overflow-hidden">
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />
            
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-toffee-brown via-saddle-brown to-toffee-brown rounded-2xl mb-6 shadow-lg"
              >
                <Shield className="text-khaki-beige-900" size={36} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-3"
              >
                Admin Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-dry-sage-500 text-sm"
              >
                Secure access to your portfolio management
              </motion.p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3 backdrop-blur-sm"
                >
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="username" className="block text-khaki-beige-900 mb-2 font-semibold text-sm">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-toffee-brown/20 to-camel/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10">
                      <User className="text-dry-sage-500 group-focus-within:text-camel transition-colors" size={20} />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-charcoal-brown/60 border border-dusty-olive/40 rounded-xl text-khaki-beige-900 placeholder-dry-sage-500 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="password" className="block text-khaki-beige-900 mb-2 font-semibold text-sm">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-toffee-brown/20 to-camel/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10">
                      <Lock className="text-dry-sage-500 group-focus-within:text-camel transition-colors" size={20} />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-charcoal-brown/60 border border-dusty-olive/40 rounded-xl text-khaki-beige-900 placeholder-dry-sage-500 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Login Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-toffee-brown via-saddle-brown to-toffee-brown hover:from-saddle-brown hover:via-toffee-brown hover:to-saddle-brown text-khaki-beige-900 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-khaki-beige-900 border-t-transparent rounded-full"
                    />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-dusty-olive/20"
            >
              <p className="text-xs text-dry-sage-500 text-center leading-relaxed">
                <span className="text-dry-sage-400">Default credentials:</span>{' '}
                <span className="font-mono text-camel">admin</span> /{' '}
                <span className="font-mono text-camel">admin123</span>
                <br />
                <span className="text-red-400/80 mt-1 block">⚠️ Change these in production!</span>
              </p>
            </motion.div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ebony/40 backdrop-blur-sm border border-dusty-olive/20 rounded-full">
              <Shield size={14} className="text-camel" />
              <span className="text-xs text-dry-sage-500">Secure Connection</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}
