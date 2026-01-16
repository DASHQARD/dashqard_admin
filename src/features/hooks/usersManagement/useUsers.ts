import { useQuery } from '@tanstack/react-query';
import {
  getAllUsers,
  getUserInfo,
  getOnboardingProgress,
  getUserOnboardingProgress,
} from '../../services/users';
import type {
  User,
  UsersListResponse,
  UserInfoResponse,
  OnboardingProgressResponse,
} from '@/types/user';

export function useUsers(query?: Record<string, any>) {
  return useQuery<UsersListResponse, Error, User[]>({
    queryKey: ['users', query],
    queryFn: () => getAllUsers(query),
  });
}

export function useUserInfo(id: string | number | undefined) {
  return useQuery<UserInfoResponse, Error>({
    queryKey: ['user-info', id],
    queryFn: () => getUserInfo(id!),
    enabled: !!id,
  });
}

export function useOnboardingProgress() {
  return useQuery<OnboardingProgressResponse, Error>({
    queryKey: ['onboarding-progress'],
    queryFn: () => getOnboardingProgress(),
  });
}

export function useUserOnboardingProgress(id: string | number | undefined) {
  return useQuery<OnboardingProgressResponse, Error>({
    queryKey: ['user-onboarding-progress', id],
    queryFn: () => getUserOnboardingProgress(id!),
    enabled: !!id,
  });
}
