import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/libs';
import { useContentGuard } from '@/hooks';
import { cn } from '@/libs';

type SectionItem = {
  path: string;
  label: string;
  icon: string;
  permission?: string;
  badgeCount?: number;
  children?: Array<{
    path: string;
    label: string;
    icon: string;
    permission?: string;
    badgeCount?: number;
  }>;
};

type Section = {
  section: string;
  items: SectionItem[];
};

type SidebarSectionProps = {
  section: Section;
  isCollapsed: boolean;
  isActive: (path: string) => boolean;
  isExpanded: (path: string) => boolean;
  toggleExpanded: (path: string) => void;
};

// Helper function to check permission (not a hook)
function hasPermission(
  permission: string | undefined,
  userPermissions: string[]
): boolean {
  if (!permission) return true;
  return userPermissions.some(
    (p) => p.toLowerCase() === permission.toLowerCase()
  );
}

export function SidebarSection({ 
  section, 
  isCollapsed, 
  isActive, 
  isExpanded, 
  toggleExpanded 
}: SidebarSectionProps) {
  // Call hooks at the top level - get all permissions once
  const { userPermissions = [] } = useContentGuard();
  
  // Filter items based on permissions (no hooks inside map)
  const visibleItems = section.items.filter((item) => {
    // Item is visible if it has no permission requirement
    if (!item.permission) return true;
    
    // Check if user has permission for this item
    const hasItemPermission = hasPermission(item.permission, userPermissions);
    
    // Check if any child has permission (if item has children)
    const hasChildrenPermission = item.children?.some((child) =>
      hasPermission(child.permission, userPermissions)
    );
    
    return hasItemPermission || hasChildrenPermission;
  });
  
  if (visibleItems.length === 0) {
    return null;
  }
  
  return (
    <React.Fragment>
      {!isCollapsed && (
        <li className="py-5 px-5 mt-5 first:mt-3">
          <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#6c757d]/90 relative flex items-center after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-5 after:h-0.5 after:bg-linear-to-r after:from-[#402D87] after:to-[rgba(64,45,135,0.4)] after:rounded-sm after:shadow-[0_1px_2px_rgba(64,45,135,0.2)] before:content-[''] before:absolute before:top-[-0.5rem] before:left-[-1.25rem] before:right-[-1.25rem] before:h-px before:bg-linear-to-r before:from-transparent before:via-black/6 before:to-transparent">
            {section.section}
          </span>
        </li>
      )}
      {visibleItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const itemExpanded = isExpanded(item.path);
        
        // Filter children based on permissions (no hooks inside map)
        const visibleChildren = item.children?.filter((child) =>
          hasPermission(child.permission, userPermissions)
        ) || [];
        
        return (
          <React.Fragment key={item.path}>
            <li
              className={cn(
                'flex flex-col mb-2 rounded-[10px] transition-all duration-200 relative overflow-hidden',
                isActive(item.path) &&
                  'bg-[rgba(64,45,135,0.08)] border-l-[3px] border-[#402D87] rounded-l-none rounded-r-[10px] shadow-[0_2px_8px_rgba(64,45,135,0.1)]',
                !isActive(item.path) &&
                  'hover:bg-[rgba(64,45,135,0.04)] hover:translate-x-px',
                isCollapsed && 'justify-center mb-3'
              )}
            >
              {isActive(item.path) && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-white/30 via-[#402D87] to-[#2d1a72] rounded-r-sm shadow-[2px_0_8px_rgba(64,45,135,0.4),2px_0_16px_rgba(64,45,135,0.2)]" />
                  <div className="absolute inset-0 rounded-r-2xl bg-linear-to-br from-white/8 via-transparent to-[rgba(45,26,114,0.03)] pointer-events-none" />
                </>
              )}
              <div className="flex items-center w-full">
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3.5 no-underline text-[#495057] font-medium text-sm py-3 px-4 flex-1 transition-all duration-200 rounded-[10px] relative z-2',
                    isActive(item.path) &&
                      'text-[#402D87] font-bold [text-shadow:0_1px_2px_rgba(64,45,135,0.2)]',
                    !isActive(item.path) && 'hover:text-[#402D87]',
                    isCollapsed && 'justify-center py-4 px-3'
                  )}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon
                    icon={item.icon}
                    className={cn(
                      'w-5 h-5 text-base flex items-center justify-center transition-all duration-200 shrink-0 text-[#6c757d]',
                      isActive(item.path) && 'text-[#402D87]',
                      !isActive(item.path) &&
                        'hover:scale-110 hover:rotate-2 hover:text-[#402D87] hover:filter-[drop-shadow(0_2px_4px_rgba(64,45,135,0.3))]'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badgeCount > 99 ? '99+' : item.badgeCount}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
                {hasChildren && !isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpanded(item.path);
                    }}
                    className={cn(
                      'p-2 mr-2 rounded-md transition-all duration-200 hover:bg-[rgba(64,45,135,0.1)]',
                      itemExpanded && 'rotate-90'
                    )}
                  >
                    <Icon
                      icon="bi:chevron-right"
                      className="w-4 h-4 text-[#6c757d]"
                    />
                  </button>
                )}
              </div>
              {isCollapsed && isActive(item.path) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-linear-to-b from-[#402D87] to-[#2d1a72] rounded-l-sm" />
              )}
            </li>
            {hasChildren && !isCollapsed && itemExpanded && visibleChildren.length > 0 && (
              <li className="mb-2 ml-6">
                <ul className="list-none p-0 m-0">
                  {visibleChildren.map((child) => (
                    <li
                      key={child.path}
                      className={cn(
                        'flex items-center mb-2 rounded-[10px] transition-all duration-200 relative overflow-hidden',
                        isActive(child.path) &&
                          'bg-[rgba(64,45,135,0.08)] border-l-[3px] border-[#402D87] rounded-l-none rounded-r-[10px] shadow-[0_2px_8px_rgba(64,45,135,0.1)]',
                        !isActive(child.path) &&
                          'hover:bg-[rgba(64,45,135,0.04)] hover:translate-x-px'
                      )}
                    >
                      {isActive(child.path) && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-white/30 via-[#402D87] to-[#2d1a72] rounded-r-sm shadow-[2px_0_8px_rgba(64,45,135,0.4),2px_0_16px_rgba(64,45,135,0.2)]" />
                          <div className="absolute inset-0 rounded-r-2xl bg-linear-to-br from-white/8 via-transparent to-[rgba(45,26,114,0.03)] pointer-events-none" />
                        </>
                      )}
                      <Link
                        to={child.path}
                        className={cn(
                          'flex items-center gap-3.5 no-underline text-[#495057] font-medium text-sm py-3 px-4 w-full transition-all duration-200 rounded-[10px] relative z-2',
                          isActive(child.path) &&
                            'text-[#402D87] font-bold [text-shadow:0_1px_2px_rgba(64,45,135,0.2)]',
                          !isActive(child.path) && 'hover:text-[#402D87]'
                        )}
                      >
                        <Icon
                          icon={child.icon}
                          className={cn(
                            'w-4 h-4 text-base flex items-center justify-center transition-all duration-200 shrink-0 text-[#6c757d]',
                            isActive(child.path) && 'text-[#402D87]',
                            !isActive(child.path) &&
                              'hover:scale-110 hover:rotate-2 hover:text-[#402D87]'
                          )}
                        />
                        <span className="flex items-center gap-2">
                          {child.label}
                          {child.badgeCount !== undefined && child.badgeCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {child.badgeCount > 99 ? '99+' : child.badgeCount}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

