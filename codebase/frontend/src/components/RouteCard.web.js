import React from 'react';
import {
  Box,
  Card,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

function StatItem({ icon, value, label }) {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        padding: '6px 4px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.25,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Typography sx={{ fontSize: '12px', lineHeight: 1 }}>{icon}</Typography>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function RouteCard({ route, index = 0, isSelected, onSelect }) {
  const rawSafety = Number(route.safetyScore ?? route.safety_score ?? 0);
  const safetyScore = rawSafety <= 10 ? rawSafety * 10 : rawSafety;
  const normalizedScore = Math.max(0, Math.min(100, Math.round(safetyScore)));
  const isSafe = normalizedScore >= 70;
  const accentColor = isSafe ? '#4CAF50' : '#FF9800';
  const badgeLabel = isSafe ? 'SAFEST' : 'CAUTION';
  const distance = route.distance || '--';
  const duration = route.duration || '--';
  const stops = route.waypoints || route.summary?.total_segments || '--';
  const riskLabel = route.riskLevel || (route.risk_score > 60 ? 'High' : route.risk_score > 30 ? 'Medium' : 'Low');
  const description = route.description || route.message || `This route passes through ${route.mainRoad || 'city roads'} with monitored corridors.`;

  return (
    <Card
      onClick={() => onSelect(route)}
      sx={{
        width: '100%',
        backgroundColor: '#1A1A1A',
        borderRadius: '12px',
        p: 1.5,
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: `1px solid ${isSelected ? '#FF6B35' : 'rgba(255,255,255,0.07)'}`,
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease',
        backgroundColor: isSelected ? '#1F1714' : '#1A1A1A',
        '&:hover': {
          borderColor: isSelected ? '#FF6B35' : alpha('#FF6B35', 0.4),
        },
      }}
    >
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, overflow: 'hidden' }}>
          <Box
            sx={{
              px: 1,
              py: 0.35,
              borderRadius: 999,
              border: `1px solid ${accentColor}`,
              backgroundColor: `${accentColor}22`,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: accentColor, lineHeight: 1.1 }}>
              {badgeLabel}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.8 }}>
          Route {index + 1} · {distance} km
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.75, gap: 0.25 }}>
          <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', lineHeight: '32px' }}>
            {normalizedScore}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#666', fontWeight: 400 }}>
            / 100
          </Typography>
          <Typography sx={{ fontSize: '10px', color: '#666', ml: 'auto', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            Safety Score
          </Typography>
        </Box>

        <Box sx={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', mb: 1.25 }}>
          <Box
            sx={{
              height: '100%',
              borderRadius: 2,
              width: `${normalizedScore}%`,
              backgroundColor: accentColor,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, mb: 1.25 }}>
          <StatItem icon="⏱" value={duration} label="min" />
          <StatItem icon="📍" value={stops} label="stops" />
          <StatItem icon="🌡" value={riskLabel} label="risk" />
        </Box>

        <Typography
          sx={{
            fontSize: '11px',
            color: '#888',
            lineHeight: '16px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Card>
  );
}
