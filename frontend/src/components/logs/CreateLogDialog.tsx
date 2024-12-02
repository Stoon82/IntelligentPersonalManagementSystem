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
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { getProjects } from '../../services/projects';
import { CreateLogDto } from '../../types/logs';
import { Project } from '../../types/project';
import { LogType, LogCreate, Log } from '../../types/log';

interface CreateLogDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Log | null;
}

const CreateLogDialog: React.FC<CreateLogDialogProps> = ({ open, onClose, initialData }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState<LogType>(LogType.OTHER);
  const [projectId, setProjectId] = React.useState<string>('');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.title);
      setDescription(initialData.content);
      setType(initialData.log_type as LogType);
      setProjectId(initialData.project_id ? initialData.project_id.toString() : '');
    } else {
      resetForm();
    }
  }, [initialData]);

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => getProjects()
  });

  const createLogMutation = useMutation({
    mutationFn: (newLog: LogCreate) => {
      if (initialData) {
        return LogService.updateLog(initialData.id, newLog);
      }
      return LogService.createLog(newLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      onClose();
      resetForm();
    }
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setType(LogType.OTHER);
    setProjectId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLogMutation.mutate({
      title: name,
      content: description,
      log_type: type,
      project_id: projectId ? parseInt(projectId) : undefined
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? 'Edit Log' : 'Create New Log'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Log Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Log Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as LogType)}
              label="Log Type"
              required
            >
              <MenuItem value={LogType.NOTE}>Note</MenuItem>
              <MenuItem value={LogType.PROGRESS}>Progress</MenuItem>
              <MenuItem value={LogType.ISSUE}>Issue</MenuItem>
              <MenuItem value={LogType.DECISION}>Decision</MenuItem>
              <MenuItem value={LogType.OTHER}>Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Project (Optional)</InputLabel>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              label="Project (Optional)"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {(projects as Project[]).map((project: Project) => (
                <MenuItem key={project.id} value={project.id.toString()}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={createLogMutation.isPending}
          >
            {createLogMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              initialData ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateLogDialog;