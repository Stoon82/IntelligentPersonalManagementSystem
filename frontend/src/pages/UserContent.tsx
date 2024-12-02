import React from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../services/logs';
import { getProjectMindmaps, Mindmap } from '../services/mindmaps';
import { getProjectConceptNotes, ConceptNote } from '../services/concepts';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import CreateLogDialog from '../components/logs/CreateLogDialog';
import { Log } from '../types/log';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function UserContent() {
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState(0);
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const [isCreateLogOpen, setIsCreateLogOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<Log | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      return response.json();
    }
  });

  // Fetch content based on selected project
  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['logs', selectedProjectId],
    queryFn: () => LogService.getLogs(selectedProjectId || undefined),
    enabled: true // Always fetch logs as they might not require project ID
  });

  const { data: mindmaps = [], isLoading: mindmapsLoading } = useQuery({
    queryKey: ['mindmaps', selectedProjectId],
    queryFn: () => selectedProjectId ? getProjectMindmaps(selectedProjectId) : Promise.resolve([]),
    enabled: !!selectedProjectId
  });

  const { data: concepts = [], isLoading: conceptsLoading } = useQuery({
    queryKey: ['concepts', selectedProjectId],
    queryFn: () => selectedProjectId ? getProjectConceptNotes(selectedProjectId) : Promise.resolve([]),
    enabled: !!selectedProjectId
  });

  // Mutations
  const deleteLogMutation = useMutation({
    mutationFn: (logId: number) => LogService.deleteLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      setIsDeleteDialogOpen(false);
      setSelectedLog(null);
    }
  });

  const handleProjectChange = (event: any) => {
    setSelectedProjectId(event.target.value === "" ? null : event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCreateLog = () => {
    setIsCreateLogOpen(true);
  };

  const handleEditLog = (log: Log) => {
    setSelectedLog(log);
    setIsCreateLogOpen(true);
  };

  const handleDeleteLog = (log: Log) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLog) {
      deleteLogMutation.mutate(selectedLog.id);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">My Content</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="project-select-label">Select Project</InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProjectId || ''}
            label="Select Project"
            onChange={handleProjectChange}
          >
            <MenuItem value="">
              <em>All Projects</em>
            </MenuItem>
            {projects.map((project: any) => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Logs" />
          <Tab label="Mindmaps" disabled={!selectedProjectId} />
          <Tab label="Notes & Concepts" disabled={!selectedProjectId} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreateLog}>
            + New Log
          </Button>
        </Box>
        <List>
          {logs.map((log) => (
            <Paper key={log.id} sx={{ mb: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={log.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {log.content}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Created: {format(new Date(log.created_at), 'PPpp')}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip label={log.log_type} size="small" sx={{ mr: 1 }} />
                  <IconButton 
                    edge="end" 
                    aria-label="edit" 
                    size="small" 
                    sx={{ mr: 1 }}
                    onClick={() => handleEditLog(log)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    size="small"
                    onClick={() => handleDeleteLog(log)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          {mindmaps.map((mindmap) => (
            <Grid item xs={12} sm={6} md={4} key={mindmap.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{mindmap.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {mindmap.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                    View
                  </Button>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <List>
          {concepts.map((concept) => (
            <Paper key={concept.id} sx={{ mb: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={concept.title}
                  secondary={concept.content}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" size="small">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Create/Edit Log Dialog */}
      <CreateLogDialog
        open={isCreateLogOpen}
        onClose={() => {
          setIsCreateLogOpen(false);
          setSelectedLog(null);
        }}
        initialData={selectedLog}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Log</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this log?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
