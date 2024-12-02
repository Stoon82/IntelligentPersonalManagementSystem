import React, { useState } from 'react';
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
  MenuItem,
  Box,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { LogType, LogCreate } from '../types/log';

interface FormData {
  title: string;
  content: string;
  log_type: LogType;
  project_id: number | undefined;
}

interface LogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LogCreate) => void;
  isSubmitting?: boolean;
  projectId?: number;
  initialData?: Partial<LogCreate>;
}

export const LogForm: React.FC<LogFormProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  projectId,
  initialData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    log_type: initialData?.log_type || LogType.NOTE,
    project_id: projectId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<LogType>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Log Entry' : 'Create New Log Entry'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Content"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select<LogType>
                name="log_type"
                value={formData.log_type}
                onChange={handleChange}
                label="Type"
              >
                {Object.values(LogType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
