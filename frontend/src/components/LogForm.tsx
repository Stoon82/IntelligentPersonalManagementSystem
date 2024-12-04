import React, { useState, useEffect, useCallback } from 'react';
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
  project_id: number | null;
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
  console.log('[LogForm] Rendering with props:', {
    open,
    isSubmitting,
    projectId: projectId ?? '(null)',
    initialData: initialData ?? '(undefined)',
  });

  // Define default form state
  const defaultFormState: FormData = {
    title: '',
    content: '',
    log_type: LogType.NOTE,
    project_id: null
  };

  // Initialize form data with proper type checking
  const getInitialState = React.useCallback((): FormData => {
    if (!initialData) {
      return {
        ...defaultFormState,
        project_id: projectId ?? null
      };
    }

    return {
      title: initialData.title ?? defaultFormState.title,
      content: initialData.content ?? defaultFormState.content,
      log_type: initialData.log_type ?? defaultFormState.log_type,
      project_id: projectId ?? defaultFormState.project_id
    };
  }, [initialData, projectId]);

  const [formData, setFormData] = useState<FormData>(getInitialState);

  useEffect(() => {
    console.log('[LogForm] Props changed, updating formData');
    const newState = getInitialState();
    console.log('[LogForm] New form state:', newState);
    setFormData(newState);
  }, [getInitialState]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log('[LogForm] Input changing:', {
      name,
      oldValue: formData[name as keyof FormData],
      newValue: value,
    });
    
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? ''
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    console.log('[LogForm] Select changing:', {
      oldValue: formData.log_type,
      newValue: e.target.value,
      type: typeof e.target.value,
    });
    
    const newValue = e.target.value;
    // Only update if we have a valid value
    if (typeof newValue === 'string' && Object.values(LogType).includes(newValue as LogType)) {
      setFormData((prev) => ({
        ...prev,
        log_type: newValue as LogType
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      project_id: formData.project_id || undefined,
    });
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
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              size="medium"
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              required
              size="medium"
            />
            <FormControl fullWidth required size="medium">
              <InputLabel id="log-type-label">Type</InputLabel>
              <Select
                labelId="log-type-label"
                name="log_type"
                value={formData.log_type}
                onChange={handleSelectChange}
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
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            size="large"
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
