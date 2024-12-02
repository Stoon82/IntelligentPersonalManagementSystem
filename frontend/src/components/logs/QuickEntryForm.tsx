import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { CreateLogEntryDto } from '../../types/logs';
import { Log, LogType } from '../../types/logs';
import { LogType as BackendLogType } from '../../types/log';

const QuickEntryForm: React.FC = () => {
  const [selectedLog, setSelectedLog] = React.useState('');
  const [content, setContent] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery<Log[]>({
    queryKey: ['logs'],
    queryFn: async () => {
      const logs = await LogService.getLogs();
      return logs.map(log => ({
        id: log.id.toString(),
        name: log.title,
        description: log.content,
        type: log.log_type as unknown as LogType,
        createdAt: log.created_at,
        updatedAt: log.updated_at,
        entries: []
      }));
    }
  });

  const createEntry = useMutation({
    mutationFn: (newEntry: CreateLogEntryDto) => LogService.createLog({
      title: "Log Entry",
      content: newEntry.content,
      log_type: BackendLogType.NOTE,
      project_id: newEntry.projectId ? parseInt(newEntry.projectId) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      setContent('');
      setTags([]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog || !content) return;

    createEntry.mutate({
      logId: selectedLog,
      content,
      tags
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Log</InputLabel>
        <Select
          value={selectedLog}
          onChange={(e) => setSelectedLog(e.target.value)}
          label="Select Log"
        >
          {logs?.map((log: Log) => (
            <MenuItem key={log.id} value={log.id}>
              {log.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        label="Log Entry"
        sx={{ mb: 2 }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={tags}
        onChange={(_, newValue) => setTags(newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Tags" placeholder="Add tags" />
        )}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!selectedLog || !content || createEntry.isPending}
      >
        Add Entry
      </Button>
    </Box>
  );
};

export default QuickEntryForm;
