declare module '@hookform/resolvers/zod' {
  import { Resolver } from 'react-hook-form';

  import { z } from 'zod';
  import { ParseParams } from 'zod';

  export const zodResolver: <T extends z.ZodType<any, any>>(
    schema: T,
    options?: ParseParams
  ) => Resolver<z.TypeOf<T>, object>;
}
