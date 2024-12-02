import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton
} from '@mui/material';
import { Log } from '../../types/logs';

interface RecentLogsProps {
  logs: Log[];
  isLoading: boolean;
}

const RecentLogs: React.FC<RecentLogsProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={100} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <List>
        {logs.map((log) =>
          log.entries.slice(0, 3).map((entry) => (
            <Paper key={entry.id} sx={{ mb: 1 }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{log.name}</Typography>
                      <Chip
                        label={log.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">{entry.content}</Typography>
                      <Box sx={{ mt: 1 }}>
                        {entry.tags?.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))
        )}
      </List>
    </Box>
  );
};

export default RecentLogs;