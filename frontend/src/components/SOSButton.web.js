import React from 'react';
import { Box, CircularProgress, Fab, Tooltip, Typography } from '@mui/material';
import AddAlertRounded from '@mui/icons-material/AddAlertRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { SOS_LONG_PRESS_DURATION } from '../constants/config';

export default function SOSButton({ onTrigger, disabled }) {
  const theme = useTheme();
  const frameRef = React.useRef(null);
  const holdingRef = React.useRef(false);
  const [progress, setProgress] = React.useState(0);

  const cancelHold = React.useCallback(() => {
    holdingRef.current = false;
    setProgress(0);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const startHold = React.useCallback(() => {
    if (disabled || holdingRef.current) return;

    holdingRef.current = true;
    const start = performance.now();

    const tick = (now) => {
      if (!holdingRef.current) return;
      const next = Math.min(100, ((now - start) / SOS_LONG_PRESS_DURATION) * 100);
      setProgress(next);

      if (next >= 100) {
        holdingRef.current = false;
        setProgress(0);
        onTrigger();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [disabled, onTrigger]);

  React.useEffect(() => () => cancelHold(), [cancelHold]);

  return (
    <Tooltip title="Hold for one second to trigger SOS mode" placement="left">
      <Box
        sx={{
          position: 'relative',
          width: 92,
          height: 92,
          display: 'grid',
          placeItems: 'center',
        }}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={90}
          thickness={2.2}
          sx={{
            position: 'absolute',
            color: theme.palette.error.main,
            opacity: progress > 0 ? 1 : 0.28,
            transition: 'opacity 180ms ease',
          }}
        />

        <Fab
          disabled={disabled}
          sx={{
            width: 76,
            height: 76,
            background: 'linear-gradient(135deg, #991B1B 0%, #DC2626 56%, #FB7185 100%)',
            color: '#FFFFFF',
            boxShadow: `0 0 0 10px ${alpha('#DC2626', 0.15)}, 0 24px 46px ${alpha(
              '#DC2626',
              0.4
            )}`,
            transform: progress > 0 ? 'scale(0.97)' : 'scale(1)',
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 56%, #F43F5E 100%)',
              boxShadow: `0 0 0 12px ${alpha(theme.palette.error.main, 0.12)}, 0 26px 50px ${alpha(
                theme.palette.error.main,
                0.38
              )}`,
            },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <AddAlertRounded sx={{ fontSize: 28 }} />
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em' }}>
              SOS
            </Typography>
          </Box>
        </Fab>
      </Box>
    </Tooltip>
  );
}
