import React, { useEffect, useState } from 'react';
import { Alert, Snackbar, Typography, Box } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { SyncService } from '../services/sync';
import { formatDistanceToNow } from 'date-fns';

interface OfflineIndicatorProps {
  syncService: SyncService;
}

declare global {
  interface WindowEventMap {
    'networkStatus': CustomEvent<{ isOnline: boolean }>;
    'syncComplete': CustomEvent<{ success: boolean }>;
  }
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ syncService }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const offline = await syncService.isOffline();
      setIsOffline(offline);
      
      const lastSyncTime = await syncService.getLastSyncTime();
      setLastSync(lastSyncTime ? new Date(lastSyncTime) : null);
    };

    checkStatus();

    const handleNetworkStatus = (event: CustomEvent<{ isOnline: boolean }>) => {
      setIsOffline(!event.detail.isOnline);
      setShowSnackbar(true);
    };

    const handleSyncComplete = async (event: CustomEvent<{ success: boolean }>) => {
      if (event.detail.success) {
        const lastSyncTime = await syncService.getLastSyncTime();
        setLastSync(lastSyncTime ? new Date(lastSyncTime) : null);
      }
    };

    window.addEventListener('networkStatus', handleNetworkStatus);
    window.addEventListener('syncComplete', handleSyncComplete);

    return () => {
      window.removeEventListener('networkStatus', handleNetworkStatus);
      window.removeEventListener('syncComplete', handleSyncComplete);
    };
  }, [syncService]);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (!isOffline && !showSnackbar) {
    return null;
  }

  return (
    <>
      {isOffline && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1400,
          }}
        >
          <WifiOffIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            You're offline. Using data from{' '}
            {lastSync
              ? formatDistanceToNow(lastSync, { addSuffix: true })
              : 'last sync'}
          </Typography>
        </Box>
      )}

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={isOffline ? 'warning' : 'success'}
          sx={{ width: '100%' }}
        >
          {isOffline
            ? 'You are now offline. Using cached data.'
            : 'Back online! Syncing data...'}
        </Alert>
      </Snackbar>
    </>
  );
}; 