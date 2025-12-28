import {
  verifyPayment,
  getPaymentsByUserId,
  getPaymentsWithUserDetails,
  getPaymentByReceiptNumber,
  getPaymentById,
  getPaymentsList,
} from '@/features/services';
import { useQuery } from '@tanstack/react-query';

export function paymentsManagementQueries() {
  function useVerifyPayment(reference: string) {
    return useQuery({
      queryKey: ['payment-verify', reference],
      queryFn: () => verifyPayment(reference),
      enabled: !!reference,
    });
  }

  function useGetPaymentsByUserId(
    userId: string,
    query?: {
      status?: string;
      type?: string;
      date_from?: string;
      date_to?: string;
    }
  ) {
    return useQuery({
      queryKey: ['payments-user', userId, query],
      queryFn: () => getPaymentsByUserId(userId, query),
      enabled: !!userId,
    });
  }

  function useGetPaymentsWithUserDetails() {
    return useQuery({
      queryKey: ['payments-with-user-details'],
      queryFn: () => getPaymentsWithUserDetails(),
    });
  }

  function useGetPaymentByReceiptNumber(receiptNumber: string) {
    return useQuery({
      queryKey: ['payment-receipt', receiptNumber],
      queryFn: () => getPaymentByReceiptNumber(receiptNumber),
      enabled: !!receiptNumber,
    });
  }

  function useGetPaymentById(id: string) {
    return useQuery({
      queryKey: ['payment', id],
      queryFn: () => getPaymentById(id),
      enabled: !!id,
    });
  }

  function useGetPaymentsList() {
    return useQuery({
      queryKey: ['payments'],
      queryFn: () => getPaymentsList(),
    });
  }

  return {
    useVerifyPayment,
    useGetPaymentsByUserId,
    useGetPaymentsWithUserDetails,
    useGetPaymentByReceiptNumber,
    useGetPaymentById,
    useGetPaymentsList,
  };
}
