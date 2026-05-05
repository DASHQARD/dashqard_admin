import { axiosClient } from '@/libs';
import type { PaymentInfoData, PaymentResponse } from '@/types';
import { postMethod } from './requests';

const uploadFiles = async (data: File[]) => {
  const formData = new FormData();
  data.forEach((file) => {
    formData.append('file', file);
  });
  const response = await axiosClient.post(`/file/upload/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const paymentInfo = async (data: PaymentInfoData) => {
  const response = await axiosClient.post(`/auth/payment-details`, data);
  return response.data;
};

const getPaymentInfo = async () => {
  const response = await axiosClient.get<PaymentResponse>(`/payments`);
  return response;
};

const getPaymentById = async (id: string) => {
  const response = await axiosClient.get<PaymentInfoData>(
    `/payments/user/${id}`
  );
  return response.data;
};

const refreshToken = async (refreshToken: string) => {
  return await postMethod(`/admin/refresh-token`, {
    refresh_token: refreshToken,
  });
};

export {
  uploadFiles,
  paymentInfo,
  getPaymentInfo,
  getPaymentById,
  refreshToken,
};
