import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@/libs';
import { useAuthStore } from '@/stores';
import { ADMIN_NAV_ITEMS, ROUTES } from '@/utils/constants';
import { cn } from '@/libs';
import { SidebarSection } from './SidebarSection';
import { usePendingRequestsCount } from '@/features/hooks/requestManagement/usePendingRequestsCount';
import { usePendingCustomersCount } from '@/features/hooks/customerManagement';
import { useInactiveVendorsCount } from '@/features/hooks/vendorManagement';
import { useOverduePaymentsCount } from '@/features/hooks/vendorPaymentsManagement';
import { useAdminService } from '@/features/hooks/useAdminService';
import { adminLogout } from '@/features/services';

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout, refreshToken } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { useAdminProfile } = useAdminService();
  const { data: adminProfile } = useAdminProfile();

  const displayName =
    (adminProfile?.first_name || adminProfile?.last_name
      ? `${adminProfile?.first_name || ''} ${adminProfile?.last_name || ''}`.trim()
      : null) ||
    (user as any)?.fullname ||
    `${(user as any)?.first_name || ''} ${(user as any)?.last_name || ''}`.trim() ||
    (user as any)?.name ||
    (user as any)?.email?.split('@')[0] ||
    'Admin';
  const userType = adminProfile?.type || (user as any)?.type || 'admin';

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', newState.toString());
  };

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await adminLogout(refreshToken);
    } catch (error) {
      // Continue with client logout even if server-side logout fails.
      console.error('Admin logout endpoint failed', error);
    } finally {
      // Clear auth state
      logout();
      // Clear React Query cache
      queryClient.clear();
      // Clear sidebar state from localStorage
      localStorage.removeItem('adminSidebarCollapsed');
      // Force full page reload to login page - use direct path since ROUTES.IN_APP.AUTH.LOGIN is '/'
      window.location.href = '/auth/login';
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsCollapsed(true);
      } else {
        const savedState = localStorage.getItem('adminSidebarCollapsed');
        if (savedState !== null) {
          setIsCollapsed(savedState === 'true');
        } else {
          setIsCollapsed(false);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => {
    if (path === ROUTES.IN_APP.ADMIN.HOME) {
      return location.pathname === path;
    }
    if (location.pathname === path) {
      return true;
    }
    if (location.pathname.startsWith(path + '/')) {
      return true;
    }
    return false;
  };

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const isExpanded = (path: string) => expandedItems.has(path);

  // Get pending requests counts
  const { corporate: corporatePendingCount, vendor: vendorPendingCount } =
    usePendingRequestsCount();

  const inactiveVendorsCount = useInactiveVendorsCount();
  const overduePaymentsCount = useOverduePaymentsCount();
  const pendingCustomersCount = usePendingCustomersCount();

  // Add badge counts to navigation items
  const navItemsWithBadges = useMemo(() => {
    return ADMIN_NAV_ITEMS.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        // Check if this is the customers, vendors or corporates item
        const isCustomersItem = item.path === ROUTES.IN_APP.ADMIN.CUSTOMERS;
        const isVendorsItem = item.path === ROUTES.IN_APP.ADMIN.VENDORS;
        const isCorporatesItem = item.path === ROUTES.IN_APP.ADMIN.CORPORATES;

        // Add badge count to children if they are request items or vendor payments
        const childrenWithBadges =
          'children' in item && item.children
            ? item.children.map((child: any) => {
                const isVendorRequest =
                  child.path === ROUTES.IN_APP.ADMIN.REQUESTS.VENDOR_REQUESTS;
                const isCorporateRequest =
                  child.path ===
                  ROUTES.IN_APP.ADMIN.REQUESTS.CORPORATE_REQUESTS;
                const isVendorPayments =
                  child.path === ROUTES.IN_APP.ADMIN.VENDOR_PAYMENTS;

                return {
                  ...child,
                  badgeCount: isVendorRequest
                    ? vendorPendingCount
                    : isCorporateRequest
                      ? corporatePendingCount
                      : isVendorPayments && overduePaymentsCount > 0
                        ? overduePaymentsCount
                        : undefined,
                };
              })
            : undefined;

        return {
          ...item,
          children: childrenWithBadges,
          // Customers: pending count; Vendors parent: inactive vendors; Corporates: pending requests
          badgeCount:
            isCustomersItem && pendingCustomersCount > 0
              ? pendingCustomersCount
              : isVendorsItem && inactiveVendorsCount > 0
                ? inactiveVendorsCount
                : isCorporatesItem && corporatePendingCount > 0
                  ? corporatePendingCount
                  : undefined,
        };
      }),
    }));
  }, [
    corporatePendingCount,
    vendorPendingCount,
    inactiveVendorsCount,
    overduePaymentsCount,
    pendingCustomersCount,
  ]);

  // Auto-expand items if any of their children are active
  useEffect(() => {
    ADMIN_NAV_ITEMS.forEach((section) => {
      section.items.forEach((item: any) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child: any) =>
            isActive(child.path)
          );
          if (hasActiveChild) {
            setExpandedItems((prev) => new Set(prev).add(item.path));
          }
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <aside
      className={cn(
        'bg-white flex flex-col w-[380px] transition-all duration-300 ease-in-out',
        'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.08),0_8px_40px_rgba(0,0,0,0.04)]',
        'border-r border-black/8 h-screen shrink-0 relative z-5',
        'max-lg:hidden',
        isCollapsed && 'w-[90px] shrink-0'
      )}
    >
      <div className="flex flex-col h-full overflow-hidden relative z-2 p-0">
        <div className="flex items-center justify-between p-6 mb-6 border-b border-black/6 bg-white relative z-1 shrink-0">
          <div
            className={cn(
              'flex items-center gap-4 flex-1 min-w-0',
              isCollapsed && 'flex-col gap-3'
            )}
          >
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-linear-to-br p-2 shadow-[0_4px_12px_rgba(64,45,135,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(64,45,135,0.35)]">
                <img
                  src="/favicon.svg"
                  alt="Dashqard logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-[#2c3e50] m-0 mb-1 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                  {displayName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#6c757d] font-medium bg-[#f8f9fa] px-3 py-1 rounded-full border border-[#e9ecef] w-fit capitalize">
                  <Icon
                    icon="bi:shield-lock"
                    className="text-xs text-[#402D87]"
                  />
                  <span>{userType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            )}
            {isCollapsed && (
              <button
                onClick={toggleSidebar}
                className="bg-transparent border-none p-2 cursor-pointer flex flex-col gap-[3px] transition-all duration-300 rounded-md hover:bg-black/5 relative z-10"
                title="Expand sidebar"
              >
                <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
                <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
                <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
              </button>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="bg-transparent border-none p-2 cursor-pointer flex flex-col gap-[3px] transition-all duration-300 rounded-md hover:bg-black/5 [&>span:nth-child(1)]:rotate-45 [&>span:nth-child(1)]:translate-x-[5px] [&>span:nth-child(1)]:translate-y-[5px] [&>span:nth-child(2)]:opacity-0 [&>span:nth-child(3)]:rotate-[-45deg] [&>span:nth-child(3)]:translate-x-[5px] [&>span:nth-child(3)]:translate-y-[-5px]"
              title="Collapse sidebar"
            >
              <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
              <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
              <span className="w-5 h-0.5 bg-[#495057] rounded-sm transition-all duration-300 origin-center" />
            </button>
          )}
        </div>

        <nav className="flex-1 relative z-1 overflow-y-auto overflow-x-hidden">
          <ul className="list-none p-0 m-0 px-5 pb-4">
            {navItemsWithBadges.map((section) => (
              <SidebarSection
                key={section.section}
                section={section}
                isCollapsed={isCollapsed}
                isActive={isActive}
                isExpanded={isExpanded}
                toggleExpanded={toggleExpanded}
              />
            ))}

            {!isCollapsed && (
              <li className="py-5 px-5 mt-5">
                <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#6c757d]/90 relative flex items-center after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-5 after:h-0.5 after:bg-linear-to-r after:from-[#402D87] after:to-[rgba(64,45,135,0.4)] after:rounded-sm after:shadow-[0_1px_2px_rgba(64,45,135,0.2)] before:content-[''] before:absolute before:top-[-0.5rem] before:left-[-1.25rem] before:right-[-1.25rem] before:h-px before:bg-gradient-to-r before:from-transparent before:via-black/6 before:to-transparent">
                  Account Actions
                </span>
              </li>
            )}
            <li
              className={cn(
                'flex items-center mb-2 rounded-[10px] transition-all duration-200 relative overflow-hidden',
                !isCollapsed &&
                  'hover:bg-[rgba(64,45,135,0.04)] hover:translate-x-px',
                isCollapsed && 'justify-center mb-3'
              )}
            >
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-3.5 no-underline text-[#495057] font-medium text-sm py-3 px-4 w-full transition-all duration-200 rounded-[10px] relative z-2 cursor-pointer bg-transparent border-none',
                  'hover:text-[#402D87]',
                  isCollapsed && 'justify-center py-4 px-3'
                )}
                title={isCollapsed ? 'Logout' : ''}
              >
                <Icon
                  icon="bi:box-arrow-right"
                  className="w-5 h-5 text-base flex items-center justify-center transition-all duration-200 shrink-0 text-[#6c757d] hover:scale-110 hover:rotate-2 hover:text-[#402D87]"
                />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
