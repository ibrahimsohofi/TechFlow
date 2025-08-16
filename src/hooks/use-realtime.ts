import { useState, useEffect, useCallback } from 'react';
import { useWebSocket, useJobUpdates as useJobUpdatesBase, useNotifications as useNotificationsBase } from '@/lib/websocket/client';

// Enhanced job updates hook
export function useJobUpdates() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { connected, subscribeToJobUpdates } = useWebSocket();

  useEffect(() => {
    if (!connected) return;

    setError(null);

    const unsubscribe = subscribeToJobUpdates((jobData: any) => {
      setJobs(prev => {
        // Update existing job or add new one
        const existingIndex = prev.findIndex(job => job.jobId === jobData.jobId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...jobData };
          return updated;
        } else {
          return [jobData, ...prev].slice(0, 50); // Keep last 50 jobs
        }
      });
    });

    return unsubscribe;
  }, [connected, subscribeToJobUpdates]);

  return {
    jobs,
    connected,
    error
  };
}

// Enhanced notifications hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { connected, subscribeToNotifications } = useWebSocket();

  useEffect(() => {
    if (!connected) return;

    setError(null);

    const unsubscribe = subscribeToNotifications((notification: any) => {
      // Add unique ID if not present
      const notificationWithId = {
        ...notification,
        id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        read: false,
        timestamp: notification.timestamp || Date.now()
      };

      setNotifications(prev => [notificationWithId, ...prev].slice(0, 100)); // Keep last 100 notifications
    });

    return unsubscribe;
  }, [connected, subscribeToNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  return {
    notifications,
    connected,
    error,
    clearNotifications,
    markAsRead,
    markAllAsRead
  };
}

// Analytics updates hook
export function useAnalyticsUpdates() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { connected, subscribeToAnalytics } = useWebSocket();

  useEffect(() => {
    if (!connected) return;

    setError(null);

    const unsubscribe = subscribeToAnalytics((analyticsData: any) => {
      setAnalytics(analyticsData);
    });

    return unsubscribe;
  }, [connected, subscribeToAnalytics]);

  return {
    analytics,
    connected,
    error
  };
}

// Connection status hook
export function useConnectionStatus() {
  const { connected, connecting, error, connectionCount } = useWebSocket();

  return {
    connected,
    connecting,
    error,
    connectionCount,
    status: connected ? 'connected' : connecting ? 'connecting' : 'disconnected'
  };
}

// Combined real-time data hook
export function useRealTimeData() {
  const jobUpdates = useJobUpdates();
  const notifications = useNotifications();
  const analytics = useAnalyticsUpdates();
  const connection = useConnectionStatus();

  return {
    jobs: jobUpdates,
    notifications,
    analytics,
    connection
  };
}
