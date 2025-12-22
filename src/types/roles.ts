import type { PERMISSION_KEYS, PERMISSION_MODULES, PERMISSION_CATEGORIES, PERMISSION_ACTIONS } from '@/utils/constants';

// Legacy permission type format: "Module action" (e.g., "Dashboard view")
export type LegacyPermissionType =
  `${(typeof PERMISSION_MODULES)[number]} ${(typeof PERMISSION_KEYS)[number]}`;

// New API permission type format: "category:action" (e.g., "vendors:view")
export type ApiPermissionType =
  `${(typeof PERMISSION_CATEGORIES)[number]}:${(typeof PERMISSION_ACTIONS)[number]}`;

// Union type supporting both formats
export type PermissionType = LegacyPermissionType | ApiPermissionType | string;
