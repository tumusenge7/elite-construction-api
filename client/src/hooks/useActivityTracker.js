import { useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { useLocation } from 'react-router-dom';

const send = (payload) => {
  fetch(API_BASE_URL + '/api/activity-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
};

export function useActivityTracker() {
  const location = useLocation();

  // Auto-track every route change as a page_view
  useEffect(() => {
    send({
      eventType: 'page_view',
      path: location.pathname + location.search,
      userAgent: navigator.userAgent,
    });
  }, [location.pathname, location.search]);

  // Manual action logger for button clicks / custom events
  const logAction = useCallback((label, meta = {}) => {
    send({
      eventType: 'click',
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      meta: { label, ...meta },
    });
  }, []);

  return { logAction };
}
