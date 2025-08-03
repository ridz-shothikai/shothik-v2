import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Box from '@mui/material/Box';

const STATUS_ICONS = {
  success: <CheckCircleIcon color="success" fontSize="small" />,
  error: <ErrorIcon color="error" fontSize="small" />,
  pending: <HourglassEmptyIcon color="warning" fontSize="small" />,
  default: <HistoryIcon color="action" fontSize="small" />,
};

const STATUS_LABELS = {
  success: 'Success',
  error: 'Error',
  pending: 'Pending',
  default: 'Unknown',
};

function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

const AgentHistoryList = ({ history = [], onSelect }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {history.length === 0 && (
        <ListItem>
          <ListItemIcon><HistoryIcon color="disabled" /></ListItemIcon>
          <ListItemText primary={<Typography color="text.secondary">No history yet.</Typography>} />
        </ListItem>
      )}
      {history.map((item, idx) => {
        const status = item.status || 'default';
        return (
          <React.Fragment key={item.id || idx}>
            <ListItem button={!!onSelect} onClick={onSelect ? () => onSelect(item) : undefined} alignItems="flex-start">
              <ListItemIcon>{STATUS_ICONS[status] || STATUS_ICONS.default}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.query || 'No query'}
                    </Typography>
                    <Chip label={STATUS_LABELS[status] || STATUS_LABELS.default} size="small" color={status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'pending' ? 'warning' : 'default'} />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                }
              />
            </ListItem>
            {idx < history.length - 1 && <Divider component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default AgentHistoryList; 