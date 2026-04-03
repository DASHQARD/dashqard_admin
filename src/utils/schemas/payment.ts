import { z } from 'zod';
import { getRequiredStringSchema } from './shared';

export const PaymentInfoSchema = z
  .object({
    payment_method: getRequiredStringSchema('Payment Method'),
    mobile_money_provider: z.string().optional(),
    mobile_money_number: z.string().optional(),
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    branch: z.string().optional(),
    account_name: z.string().optional(),
    sort_swift_code: z.string().optional(),
    become_vendor: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_method === 'mobile_money') {
        return !!(data.mobile_money_provider && data.mobile_money_number);
      }
      return true;
    },
    {
      message: 'Mobile Money Provider and Mobile Money Number are required',
      path: ['mobile_money_provider'],
    }
  )
  .refine(
    (data) => {
      if (data.payment_method === 'mobile_money') {
        return !!(data.mobile_money_provider && data.mobile_money_number);
      }
      return true;
    },
    {
      message: 'Mobile Money Provider and Mobile Money Number are required',
      path: ['mobile_money_number'],
    }
  )
  .refine(
    (data) => {
      if (data.payment_method === 'bank') {
        return !!(
          data.bank_name &&
          data.account_number &&
          data.branch &&
          data.account_name &&
          data.sort_swift_code
        );
      }
      return true;
    },
    {
      message:
        'All bank details are required (Bank Name, Account Number, Branch, Account Name, Sort/Swift Code)',
      path: ['bank_name'],
    }
  );

export const PaymentFormSchema = z
  .object({
    payment_method: getRequiredStringSchema('Payment method'),
    /** Optional override; backend uses payment provider config when empty */
    payment_service: z.string().optional(),
    mobile_money_provider: z.string().optional(),
    mobile_money_number: z.string().optional(),
    bank_code: z.string().optional(),
    account_number: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Payment method is required
      return !!data.payment_method;
    },
    {
      message: 'Payment method is required',
      path: ['payment_method'],
    }
  )
  .refine(
    (data) => {
      // If payment_method is mobile_money, provider and number are required
      if (data.payment_method === 'mobile_money') {
        return !!(data.mobile_money_provider && data.mobile_money_number);
      }
      return true;
    },
    {
      message: 'Mobile Money Provider and Mobile Money Number are required',
      path: ['mobile_money_provider'],
    }
  )
  .refine(
    (data) => {
      // If payment_method is bank, all bank fields are required
      if (data.payment_method === 'bank') {
        return !!(data.bank_code && data.account_number);
      }
      return true;
    },
    {
      message: 'All bank details are required',
      path: ['bank_code'],
    }
  )
  .refine(
    (data) => {
      const v = data.payment_service?.trim();
      if (!v) return true;
      return ['paystack', 'eganow', 'express_payout'].includes(v);
    },
    {
      message: 'Payment service must be paystack, eganow, or express_payout',
      path: ['payment_service'],
    }
  );
