import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  IconButton,
  Fab,
  Tooltip,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@tanstack/react-query';
import { reportBug } from '../services/bugs';

interface BugReportProps {
  errorLogs?: string[];
}

export const BugReport: React.FC<BugReportProps> = ({ errorLogs = [] }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [systemInfo, setSystemInfo] = useState('');

  const reportBugMutation = useMutation({
    mutationFn: reportBug,
    onSuccess: () => {
      setOpen(false);
      setTitle('');
      setDescription('');
      // You could add a success notification here
    },
  });

  useEffect(() => {
    // Gather system information
    const gatherSystemInfo = async () => {
      const info = {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };
      setSystemInfo(JSON.stringify(info, null, 2));
    };
    gatherSystemInfo();
  }, []);

  const handleSubmit = () => {
    reportBugMutation.mutate({
      title,
      description,
      systemInfo,
      errorLogs,
    });
  };

  return (
    <>
      <Tooltip title="Report Bug">
        <Fab
          color="secondary"
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        >
          <BugReportIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Report a Bug</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the bug"
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe what happened and what you expected to happen"
            />

            {errorLogs.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Error Logs
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={errorLogs.join('\n')}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                System Information
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={systemInfo}
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!title || !description || reportBugMutation.isPending}
          >
            Submit Bug Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
