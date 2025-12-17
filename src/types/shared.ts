import type { DEFAULT_QUERY } from '@/utils/constants';

export type DropdownOption = {
  label: string;
  value: string;
};
export type NativeEventHandler = (
  e: Event & { target: HTMLInputElement }
) => void;
export type QueryType = typeof DEFAULT_QUERY;

export type generateCsvParams = {
  headers: Array<CsvHeader>;
  data: Array<any>;
  separator?: string;
  fileName?: string;
};

export type CsvHeader = {
  name: string;
  accessor: string;
  transform?: (v: any) => string;
};

export type TableCellProps<T extends Record<string, any> = { id: string }> =
  Readonly<{
    getValue: () => any;
    row: {
      original: {
        id: string;
        [key: string]: any;
      } & T;
    };
  }>;

export interface PersistedModalStateReturn<TModalData = unknown> {
  modalState: string | null;
  modalData: TModalData | null;
  openModal: (modalName: string, data?: TModalData) => void;
  closeModal: () => void;
  isModalOpen: (modalName?: string) => boolean;
}

export interface PersistedModalStateOptions {
  paramName?: string; // URL parameter name (default: 'modal')
  defaultValue?: string | null; // Default modal state
  resetOnRouteChange?: boolean; // Reset modal when route changes (default: false)
}

export type FileType = {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  status: string;
};

export type TierType =
  | '1'
  | '2'
  | '3'
  | 'M1'
  | 'M2'
  | 'M3'
  | 'A1'
  | 'A2'
  | 'A3';
