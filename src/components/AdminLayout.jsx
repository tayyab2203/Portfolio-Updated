'use client';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Code,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMdOrLarger, setIsMdOrLarger] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const mq = window.matchMedia('(min-width: 768px)');
    setIsMdOrLarger(mq.matches);
    const handler = () => setIsMdOrLarger(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/admin/login';
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/skills', label: 'Skills', icon: Code },
    { href: '/admin/company', label: 'Company', icon: Building2 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const backNav = useMemo(() => {
    if (!pathname || pathname === '/admin') return null;
    if (pathname.startsWith('/admin/projects/new') || pathname.match(/^\/admin\/projects\/[^/]+$/)) {
      return { href: '/admin/projects', label: 'Projects' };
    }
    return { href: '/admin', label: 'Dashboard' };
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Admin Header: always visible, with Logout on the right */}
      <header className="sticky top-0 z-50 bg-ebony/95 backdrop-blur-sm border-b border-dusty-olive/30 flex items-center justify-between px-4 sm:px-6 h-14 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-dry-sage-600 hover:text-khaki-beige hover:bg-ebony/50 transition"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="text-lg font-bold text-khaki-beige-900 font-comfortaa">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-dry-sage-600 hover:text-khaki-beige hover:bg-ebony/50 transition text-sm"
          >
            <Home size={18} />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 transition font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar: visible from md up, slide-in on mobile */}
        <motion.aside
          initial={false}
          animate={{
            x: isSidebarOpen || isMdOrLarger ? 0 : -280,
          }}
          className={`fixed md:relative inset-y-0 left-0 top-14 md:top-0 w-64 h-[calc(100vh-3.5rem)] md:min-h-screen md:h-full bg-ebony/95 backdrop-blur-sm border-r border-dusty-olive/30 z-40 md:z-auto flex flex-col shrink-0`}
        >
          <div className="p-4 border-b border-dusty-olive/30 md:border-b-0">
            <p className="text-dry-sage-600 text-xs font-medium uppercase tracking-wider">Menu</p>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-toffee-brown/20 to-saddle-brown/20 text-khaki-beige-900 border border-camel/30'
                      : 'text-dry-sage-600 hover:text-khaki-beige hover:bg-ebony/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-dusty-olive/30 md:hidden">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-dry-sage-600 hover:text-khaki-beige hover:bg-ebony/50 transition"
            >
              <Home size={20} />
              <span className="font-medium">View Site</span>
            </Link>
          </div>
        </motion.aside>

        {isSidebarOpen && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            aria-label="Close sidebar"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {backNav && (
              <Link
                href={backNav.href}
                className="inline-flex items-center gap-2 text-dry-sage-600 hover:text-camel transition text-sm mb-4"
              >
                <ArrowLeft size={18} />
                <span>Back to {backNav.label}</span>
              </Link>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
