import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { LogEntryCreate, LogEntryUpdate } from '../../types/log';

interface LogEntryFormProps {
  open: boolean;
  onClose: () => void;
  logId: number;
  initialData?: {
    id: number;
    content: string;
  };
}

export const LogEntryForm: React.FC<LogEntryFormProps> = ({
  open,
  onClose,
  logId,
  initialData
}) => {
  const [content, setContent] = useState(initialData?.content || '');
  const queryClient = useQueryClient();

  const createEntry = useMutation({
    mutationFn: (data: LogEntryCreate) => LogService.createLogEntry(logId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', logId] });
      handleClose();
    }
  });

  const updateEntry = useMutation({
    mutationFn: (data: LogEntryUpdate) => 
      LogService.updateLogEntry(logId, initialData!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', logId] });
      handleClose();
    }
  });

  const handleClose = () => {
    setContent('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const data = { content };
    if (initialData) {
      updateEntry.mutate(data);
    } else {
      createEntry.mutate(data);
    }
  };

  const isSubmitting = createEntry.isPending || updateEntry.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Entry' : 'New Entry'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!content.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
