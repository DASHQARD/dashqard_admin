import { deleteMethod, getMethod } from '@/services';

const commonUrl = '/payment-details';

export const deletePaymentDetail = async (id: string): Promise<any> => {
  return await deleteMethod(`${commonUrl}/${id}`);
};

export const getPaymentsDailyStats = async (): Promise<any> => {
  const response = await getMethod('/payments/stats/daily');
  // Response structure: { status, statusCode, message, data: [...], url: "..." }
  // Data is an array of daily stats: [{ date, total_count, total_amount, currency }, ...]
  // Extract the data array from the response
  return response?.data || response;
};
