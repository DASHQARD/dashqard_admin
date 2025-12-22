import type z from 'zod';
import type { toggleSavingsStatusSchema } from '@/utils/schemas/shared';

export type ToggleSavingsStatusSchemaType = z.infer<
  typeof toggleSavingsStatusSchema
>;
