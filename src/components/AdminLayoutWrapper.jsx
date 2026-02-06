'use client';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

/**
 * Wraps admin routes with AdminLayout (sidebar + main) only for dashboard pages.
 * Login page (/admin/login) renders without sidebar so it can be full-width and centered.
 */
export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
