import type { PERMISSION_KEYS, PERMISSION_MODULES } from '@/utils/constants';

export type PermissionType =
  `${(typeof PERMISSION_MODULES)[number]} ${(typeof PERMISSION_KEYS)[number]}`;
