import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Skeleton
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { Log, LogEntry } from '../../types/log';
import { LogEntryForm } from './LogEntryForm';
import { formatDistanceToNow } from 'date-fns';

interface LogViewProps {
  logId: number;
}

export const LogView: React.FC<LogViewProps> = ({ logId }) => {
  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();

  const { data: log, isLoading } = useQuery<Log>({
    queryKey: ['logs', logId],
    queryFn: () => LogService.getLog(logId)
  });

  const deleteEntry = useMutation({
    mutationFn: (entryId: number) => LogService.deleteLogEntry(logId, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', logId] });
      handleCloseMenu();
    }
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, entryId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEntryId(entryId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedEntryId(null);
  };

  const handleEditEntry = (entry: LogEntry) => {
    setSelectedEntry(entry);
    setEntryFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteEntry = () => {
    if (selectedEntryId) {
      deleteEntry.mutate(selectedEntryId);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={60} />
        <Skeleton height={40} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={100} sx={{ my: 1 }} />
        ))}
      </Box>
    );
  }

  if (!log) {
    return <Typography color="error">Log not found</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {log.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {log.content}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEntry(null);
            setEntryFormOpen(true);
          }}
        >
          New Entry
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List>
        {log.entries.map((entry) => (
          <Paper key={entry.id} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={(e) => handleOpenMenu(e, entry.id)}
                >
                  <MoreIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                      {entry.content}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem 
          onClick={() => {
            const entry = log.entries.find(e => e.id === selectedEntryId);
            if (entry) {
              handleEditEntry(entry);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteEntry}>Delete</MenuItem>
      </Menu>

      <LogEntryForm
        open={entryFormOpen}
        onClose={() => {
          setEntryFormOpen(false);
          setSelectedEntry(null);
        }}
        logId={logId}
        initialData={selectedEntry ? {
          id: selectedEntry.id,
          content: selectedEntry.content
        } : undefined}
      />
    </Box>
  );
};
