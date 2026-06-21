import {
  getVendorsList,
  getVendorDetails,
  getVendorQrCode,
  getVendorBranches,
  getVendorsAllDetails,
  getVendorCatalog,
} from '@/features/services';
import type {
  AdminVendorsQueryParams,
  VendorBranchesQueryParams,
  VendorCatalogQueryParams,
  VendorsAllDetailsQueryParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function vendorManagementQueries() {
  function useGetVendors(
    queryParams?: AdminVendorsQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendors', queryParams],
      queryFn: () => getVendorsList(queryParams),
      enabled: options?.enabled ?? true,
    });
  }

  function useGetVendorDetails(
    id: string | number,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendor-details', id],
      queryFn: () => getVendorDetails(id),
      enabled: !!id && (options?.enabled ?? true),
    });
  }

  function useGetVendorQrCode(id: string | number) {
    return useQuery({
      queryKey: ['vendor-qr-code', id],
      queryFn: () => getVendorQrCode(id),
      enabled: false, // Only fetch when explicitly called
    });
  }

  function useGetVendorBranches(
    vendorId: string,
    query?: VendorBranchesQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendor-branches', vendorId, query],
      queryFn: () => getVendorBranches(vendorId, query),
      enabled: !!vendorId && (options?.enabled ?? true),
    });
  }

  function useGetVendorsAllDetails(
    query?: VendorsAllDetailsQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendors-all-details', query],
      queryFn: () => getVendorsAllDetails(query),
      enabled: options?.enabled ?? true,
    });
  }

  function useGetVendorCatalog(
    gvid: string,
    query?: VendorCatalogQueryParams,
    options?: { enabled?: boolean }
  ) {
    return useQuery({
      queryKey: ['vendor-catalog', gvid, query],
      queryFn: () => getVendorCatalog(gvid, query),
      enabled: !!gvid && (options?.enabled ?? true),
    });
  }

  return {
    useGetVendors,
    useGetVendorDetails,
    useGetVendorQrCode,
    useGetVendorBranches,
    useGetVendorsAllDetails,
    useGetVendorCatalog,
  };
}
