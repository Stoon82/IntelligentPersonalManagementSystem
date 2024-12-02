import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import QuickEntryForm from './QuickEntryForm';
import RecentLogs from './RecentLogs';
import CreateLogDialog from './CreateLogDialog';
import { useQuery } from '@tanstack/react-query';
import { LogService } from '../../services/logs';
import { Log, LogType } from '../../types/logs';

export const LogAssistant: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const { data: recentLogs = [], isLoading } = useQuery<Log[]>({
    queryKey: ['logs', 'recent'],
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

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Log Assistant</Typography>
        <IconButton 
          color="primary" 
          onClick={() => setCreateDialogOpen(true)}
          sx={{ ml: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <QuickEntryForm />
      </Paper>

      <RecentLogs logs={recentLogs || []} isLoading={isLoading} />

      <CreateLogDialog 
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
};

export default LogAssistant;