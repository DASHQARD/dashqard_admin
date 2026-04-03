import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type {
  PersistedModalStateOptions,
  PersistedModalStateReturn,
} from '@/types';

export function usePersistedModalState<TModalData = unknown>({
  paramName = 'modal',
  defaultValue = null,
  resetOnRouteChange = false,
}: PersistedModalStateOptions = {}): PersistedModalStateReturn<TModalData> {
  const location = useLocation();
  const navigate = useNavigate();

  const previousPathRef = useRef(location.pathname);

  // Read from location.search so state stays in sync with navigation (incl. nuqs + Link clicks).
  const { modalState, modalDataFromUrl } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      modalState: params.get(paramName) ?? defaultValue ?? '',
      modalDataFromUrl: params.get('modalData') ?? '',
    };
  }, [location.search, paramName, defaultValue]);

  const openModal = useCallback(
    (modalName: string, data?: TModalData) => {
      const newParams = new URLSearchParams(location.search);
      newParams.set(paramName, modalName);

      if (data !== undefined) {
        try {
          newParams.set('modalData', JSON.stringify(data));
        } catch (error) {
          console.warn('Failed to serialize modal data:', error);
          newParams.delete('modalData');
        }
      } else {
        newParams.delete('modalData');
      }

      const search = newParams.toString();
      navigate(
        { pathname: location.pathname, search: search ? `?${search}` : '' },
        { replace: true }
      );
    },
    [paramName, navigate, location.pathname, location.search]
  );

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete(paramName);
    newParams.delete('modalData');
    const search = newParams.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : '' },
      { replace: true }
    );
  }, [paramName, navigate, location.pathname, location.search]);

  const isModalOpen = useCallback(
    (modalName?: string) => {
      const currentModal = modalState || null;
      if (!modalName) {
        return Boolean(currentModal);
      }
      return currentModal === modalName;
    },
    [modalState]
  );

  const parsedModalData = useMemo(() => {
    if (!modalDataFromUrl) return null;
    try {
      return JSON.parse(modalDataFromUrl) as TModalData;
    } catch (error) {
      console.warn('Failed to parse modal data from URL:', error);
      return null;
    }
  }, [modalDataFromUrl]);

  useEffect(() => {
    if (resetOnRouteChange && location.pathname !== previousPathRef.current) {
      closeModal();
    }
    previousPathRef.current = location.pathname;
  }, [resetOnRouteChange, location.pathname, closeModal]);

  return useMemo(
    () => ({
      modalState: modalState || null,
      modalData: parsedModalData,
      openModal,
      closeModal,
      isModalOpen,
    }),
    [modalState, parsedModalData, openModal, closeModal, isModalOpen]
  );
}
