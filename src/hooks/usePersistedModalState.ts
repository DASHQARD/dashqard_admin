import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type {
  PersistedModalStateOptions,
  PersistedModalStateReturn,
} from '@/types';
import {
  buildModalCacheKey,
  clearModalDataCacheForPath,
  deleteModalDataCache,
  extractModalRecordId,
  getModalDataCache,
  setModalDataCache,
} from '@/utils/modalDataCache';

export function usePersistedModalState<TModalData = unknown>({
  paramName = 'modal',
  defaultValue = null,
  resetOnRouteChange = false,
}: PersistedModalStateOptions = {}): PersistedModalStateReturn<TModalData> {
  const location = useLocation();
  const navigate = useNavigate();

  const previousPathRef = useRef(location.pathname);
  const activeCacheKeyRef = useRef<string | null>(null);

  const { modalState, modalIdFromUrl } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      modalState: params.get(paramName) ?? defaultValue ?? '',
      modalIdFromUrl: params.get('modalId') ?? '',
    };
  }, [location.search, paramName, defaultValue]);

  // Strip legacy `modalData` blobs from URLs (PII / signed URLs must not live in history).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const legacyModalData = params.get('modalData');
    if (!legacyModalData) return;

    params.delete('modalData');

    if (!params.get('modalId')) {
      try {
        const parsed = JSON.parse(legacyModalData) as unknown;
        const recordId = extractModalRecordId(parsed);
        if (recordId) {
          params.set('modalId', recordId);
          const modalName = params.get(paramName);
          if (modalName) {
            const cacheKey = buildModalCacheKey(
              location.pathname,
              paramName,
              modalName,
              recordId
            );
            setModalDataCache(cacheKey, parsed);
            activeCacheKeyRef.current = cacheKey;
          }
        }
      } catch {
        // Ignore malformed legacy payloads.
      }
    }

    const search = params.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : '' },
      { replace: true }
    );
  }, [location.search, location.pathname, paramName, navigate]);

  const openModal = useCallback(
    (modalName: string, data?: TModalData) => {
      const newParams = new URLSearchParams(location.search);
      newParams.set(paramName, modalName);
      newParams.delete('modalData');

      const recordId = data !== undefined ? extractModalRecordId(data) : null;

      if (recordId) {
        newParams.set('modalId', recordId);
        const cacheKey = buildModalCacheKey(
          location.pathname,
          paramName,
          modalName,
          recordId
        );
        setModalDataCache(cacheKey, data);
        activeCacheKeyRef.current = cacheKey;
      } else {
        newParams.delete('modalId');
        if (activeCacheKeyRef.current) {
          deleteModalDataCache(activeCacheKeyRef.current);
          activeCacheKeyRef.current = null;
        }
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
    if (activeCacheKeyRef.current) {
      deleteModalDataCache(activeCacheKeyRef.current);
      activeCacheKeyRef.current = null;
    }

    const newParams = new URLSearchParams(location.search);
    newParams.delete(paramName);
    newParams.delete('modalId');
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

  const resolvedModalData = useMemo(() => {
    if (!modalState) return null;

    if (modalIdFromUrl) {
      const cacheKey = buildModalCacheKey(
        location.pathname,
        paramName,
        modalState,
        modalIdFromUrl
      );
      const cached = getModalDataCache<TModalData>(cacheKey);
      if (cached !== undefined) {
        activeCacheKeyRef.current = cacheKey;
        return cached;
      }

      return { id: modalIdFromUrl } as TModalData;
    }

    return null;
  }, [modalState, modalIdFromUrl, location.pathname, paramName]);

  useEffect(() => {
    if (resetOnRouteChange && location.pathname !== previousPathRef.current) {
      clearModalDataCacheForPath(previousPathRef.current, paramName);
      closeModal();
    }
    previousPathRef.current = location.pathname;
  }, [resetOnRouteChange, location.pathname, closeModal, paramName]);

  return useMemo(
    () => ({
      modalState: modalState || null,
      modalData: resolvedModalData,
      openModal,
      closeModal,
      isModalOpen,
    }),
    [modalState, resolvedModalData, openModal, closeModal, isModalOpen]
  );
}
