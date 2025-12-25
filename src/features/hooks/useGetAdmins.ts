import { useQuery } from '@tanstack/react-query'
import { getAllAdmins } from '../services'
import type { AdminsQueryParams } from '@/types/admin'

export const useAdmins = (params?: AdminsQueryParams) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => getAllAdmins(params),
  })
}
