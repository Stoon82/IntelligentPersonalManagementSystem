import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { CreateLogDto, LogType } from '../../types/logs';
import { LogType as BackendLogType } from '../../types/log';

interface CreateLogDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateLogDialog: React.FC<CreateLogDialogProps> = ({ open, onClose }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState<LogType>('custom');
  const [projectId, setProjectId] = React.useState('');
  const queryClient = useQueryClient();

  const createLog = useMutation({
    mutationFn: (newLog: CreateLogDto) => LogService.createLog({
      title: newLog.name,
      content: newLog.description,
      log_type: newLog.type as unknown as BackendLogType,
      project_id: newLog.projectId ? parseInt(newLog.projectId) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      handleClose();
    }
  });

  const handleClose = () => {
    setName('');
    setDescription('');
    setType('custom');
    setProjectId('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    createLog.mutate({
      name,
      description,
      type,
      projectId
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Log</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Log Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as LogType)}
              label="Type"
              required
            >
              <MenuItem value="changelog">Changelog</MenuItem>
              <MenuItem value="devlog">Development Log</MenuItem>
              <MenuItem value="buglog">Bug Log</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!name || !type || createLog.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateLogDialog;