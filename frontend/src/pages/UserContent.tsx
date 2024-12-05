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
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../services/logs';
import { getProjectMindmaps, createMindmap, updateMindmap, deleteMindmap, Mindmap, MindmapNode } from '../services/mindmaps';
import { getProjectConceptNotes, createConceptNote, updateConceptNote, deleteConceptNote, ConceptNote, ConceptNoteUpdate } from '../services/concepts';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import CreateLogDialog from '../components/logs/CreateLogDialog';
import { Log } from '../types/log';
import { getIdeas, createIdea, updateIdea, deleteIdea } from '../services/ideas';
import { Idea, IdeaCreate, IdeaUpdate } from '../types/idea';
import { getJournals, Journal, deleteJournal } from '../services/journals';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const [isCreateLogOpen, setIsCreateLogOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<Log | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteItemType, setDeleteItemType] = React.useState<'log' | 'mindmap' | 'concept' | 'idea' | 'journal'>('log');
  const [selectedItemId, setSelectedItemId] = React.useState<number | null>(null);
  const [isCreateMindmapOpen, setIsCreateMindmapOpen] = React.useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = React.useState(false);
  const [isCreateIdeaOpen, setIsCreateIdeaOpen] = React.useState(false);
  const [newMindmap, setNewMindmap] = React.useState({ title: '', text: '' });
  const [newNote, setNewNote] = React.useState({ title: '', content: '' });
  const [newIdea, setNewIdea] = React.useState<{
    title: string;
    description: string;
    status: 'draft' | 'in_progress' | 'implemented' | 'archived';
    tags: string[];
  }>({ 
    title: '', 
    description: '', 
    status: 'draft', 
    tags: [] 
  });
  const [selectedMindmap, setSelectedMindmap] = React.useState<Mindmap | null>(null);
  const [selectedNote, setSelectedNote] = React.useState<ConceptNote | null>(null);
  const [selectedIdea, setSelectedIdea] = React.useState<Idea | null>(null);
  const [isEditMindmapOpen, setIsEditMindmapOpen] = React.useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = React.useState(false);
  const [isEditIdeaOpen, setIsEditIdeaOpen] = React.useState(false);

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      return response.json();
    }
  });

  // Fetch content based on selected project
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['logs', selectedProjectId],
    queryFn: async () => {
      const response = await fetch(selectedProjectId ? `/api/projects/${selectedProjectId}/logs` : '/api/logs');
      return response.json();
    },
    enabled: true
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

  const { data: ideas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ['ideas', selectedProjectId],
    queryFn: () => getIdeas(selectedProjectId || undefined),
    enabled: !!selectedProjectId
  });

  const { data: journals = [] } = useQuery({
    queryKey: ['journals'],
    queryFn: () => getJournals(),
  });

  // Create mutations
  const createMindmapMutation = useMutation({
    mutationFn: (data: { title: string, text: string }) => {
      const mindmapNode: MindmapNode = {
        id: 'root',
        text: data.text,
        children: []
      };
      return createMindmap(data.title, mindmapNode, selectedProjectId || 0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindmaps'] });
    }
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, content: string }) => 
      createConceptNote({
        title: data.title,
        content: data.content,
        project_id: selectedProjectId || 0
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    }
  });

  const createIdeaMutation = useMutation({
    mutationFn: (data: IdeaCreate) => createIdea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });

  // Update mutations
  const updateMindmapMutation = useMutation({
    mutationFn: (data: { id: number; title: string; text: string }) => {
      const mindmapNode: MindmapNode = {
        id: 'root',
        text: data.text,
        children: []
      };
      return updateMindmap(data.id, data.title, mindmapNode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindmaps'] });
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: (data: ConceptNoteUpdate) => 
      updateConceptNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    }
  });

  const updateIdeaMutation = useMutation({
    mutationFn: (data: { id: number } & IdeaUpdate) => updateIdea({ ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });

  // Delete mutations
  const deleteLogMutation = useMutation({
    mutationFn: (logId: number) => LogService.deleteLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    }
  });

  const deleteMindmapMutation = useMutation({
    mutationFn: (id: number) => deleteMindmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindmaps'] });
    }
  });

  const deleteConceptMutation = useMutation({
    mutationFn: (id: number) => deleteConceptNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    }
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: (id: number) => deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });

  const deleteJournalMutation = useMutation({
    mutationFn: (id: number) => deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setIsDeleteDialogOpen(false);
    },
  });

  const handleProjectChange = (event: any) => {
    setSelectedProjectId(event.target.value === "" ? null : event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditLog = (log: Log) => {
    setSelectedLog(log);
    setIsCreateLogOpen(true);
  };

  const handleDeleteItem = (type: 'log' | 'mindmap' | 'concept' | 'idea' | 'journal', id: number) => {
    setDeleteItemType(type);
    setSelectedItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedItemId) return;

    switch (deleteItemType) {
      case 'log':
        deleteLogMutation.mutate(selectedItemId);
        break;
      case 'mindmap':
        deleteMindmapMutation.mutate(selectedItemId);
        break;
      case 'concept':
        deleteConceptMutation.mutate(selectedItemId);
        break;
      case 'idea':
        deleteIdeaMutation.mutate(selectedItemId);
        break;
      case 'journal':
        deleteJournalMutation.mutate(selectedItemId);
        break;
    }
  };

  const handleCreateMindmap = () => {
    createMindmapMutation.mutate(newMindmap);
    setIsCreateMindmapOpen(false);
    setNewMindmap({ title: '', text: '' });
  };

  const handleCreateNote = () => {
    createNoteMutation.mutate(newNote);
    setIsCreateNoteOpen(false);
    setNewNote({ title: '', content: '' });
  };

  const handleCreateIdea = () => {
    createIdeaMutation.mutate(newIdea as IdeaCreate);
    setIsCreateIdeaOpen(false);
    setNewIdea({ title: '', description: '', status: 'draft', tags: [] });
  };

  const handleEditMindmap = (mindmap: Mindmap) => {
    setSelectedMindmap(mindmap);
    setNewMindmap({ title: mindmap.title, text: mindmap.data.text });
    setIsEditMindmapOpen(true);
  };

  const handleUpdateMindmap = () => {
    if (!selectedMindmap) return;
    updateMindmapMutation.mutate({
      id: selectedMindmap.id,
      title: newMindmap.title,
      text: newMindmap.text
    });
  };

  const handleEditNote = (note: ConceptNote) => {
    setSelectedNote(note);
    setNewNote({ title: note.title, content: note.content });
    setIsEditNoteOpen(true);
  };

  const handleUpdateNote = () => {
    if (!selectedNote) return;
    updateNoteMutation.mutate({
      id: selectedNote.id,
      title: newNote.title,
      content: newNote.content
    });
  };

  const handleEditIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setNewIdea({
      title: idea.title,
      description: idea.description,
      status: idea.status,
      tags: idea.tags.map(tag => tag.name)
    });
    setIsEditIdeaOpen(true);
  };

  const handleUpdateIdea = () => {
    if (!selectedIdea) return;
    updateIdeaMutation.mutate({
      id: selectedIdea.id,
      title: newIdea.title,
      description: newIdea.description,
      status: newIdea.status,
      tags: newIdea.tags
    });
  };

  const clearInputs = () => {
    setNewMindmap({ title: '', text: '' });
    setNewNote({ title: '', content: '' });
    setNewIdea({ title: '', description: '', status: 'draft', tags: [] });
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
          <Tab label="Mindmaps" />
          <Tab label="Notes & Concepts" />
          <Tab label="Ideas" />
          <Tab label="Journals" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => setIsCreateLogOpen(true)}
            >
              New Log
            </Button>
          </Box>
        )}
        <List>
          {logs.map((log) => (
            <Paper key={log.id} sx={{ mb: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={log.title}
                  secondary={
                    <Box component="span">
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        display="block"
                      >
                        {log.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Created: {format(new Date(log.created_at), 'PPpp')}
                      </Typography>
                    </Box>
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
                    onClick={() => handleDeleteItem('log', log.id)}
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
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setIsCreateMindmapOpen(true)}
            disabled={!selectedProjectId}
          >
            New Mindmap
          </Button>
        </Box>
        {!selectedProjectId ? (
          <Typography>Please select a project to view mindmaps</Typography>
        ) : mindmapsLoading ? (
          <Typography>Loading mindmaps...</Typography>
        ) : mindmaps.length === 0 ? (
          <Typography>No mindmaps found. Create one to get started!</Typography>
        ) : (
          <Grid container spacing={3}>
            {mindmaps.map((mindmap: Mindmap) => (
              <Grid item xs={12} sm={6} md={4} key={mindmap.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{mindmap.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {mindmap.data.text}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditMindmap(mindmap)}
                    >
                      View
                    </Button>
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditMindmap(mindmap)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteItem('mindmap', mindmap.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setIsCreateNoteOpen(true)}
            disabled={!selectedProjectId}
          >
            New Note
          </Button>
        </Box>
        {!selectedProjectId ? (
          <Typography>Please select a project to view notes</Typography>
        ) : conceptsLoading ? (
          <Typography>Loading concepts...</Typography>
        ) : concepts.length === 0 ? (
          <Typography>No notes found. Create one to get started!</Typography>
        ) : (
          <List>
            {concepts.map((concept: ConceptNote) => (
              <Paper key={concept.id} sx={{ mb: 2, p: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={<Box component="span">{concept.title}</Box>}
                    secondary={<Box component="span">{concept.content}</Box>}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditNote(concept)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      size="small"
                      onClick={() => handleDeleteItem('concept', concept.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setIsCreateIdeaOpen(true)}
            disabled={!selectedProjectId}
          >
            New Idea
          </Button>
        </Box>
        {!selectedProjectId ? (
          <Typography>Please select a project to view ideas</Typography>
        ) : ideasLoading ? (
          <Typography>Loading ideas...</Typography>
        ) : ideas.length === 0 ? (
          <Typography>No ideas found. Create one to get started!</Typography>
        ) : (
          <Grid container spacing={3}>
            {ideas.map((idea: Idea) => (
              <Grid item xs={12} sm={6} md={4} key={idea.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{idea.title}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {idea.description}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                    <Chip
                      label={idea.status}
                      size="small"
                      color={idea.status === 'draft' ? 'default' : idea.status === 'in_progress' ? 'primary' : 'success'}
                    />
                    {idea.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditIdea(idea)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteItem('idea', idea.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/journal/new')}
          >
            New Journal Entry
          </Button>
        </Box>
        {journals.length > 0 ? (
          <List>
            {journals.map((journal: Journal) => (
              <Paper key={journal.id} sx={{ mb: 2, p: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={journal.title}
                    secondary={
                      <Box component="span">
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          display="block"
                        >
                          {journal.content}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="textSecondary"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          Created: {format(new Date(journal.created_at), 'PPpp')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => navigate(`/journal/${journal.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setSelectedItemId(journal.id);
                        setDeleteItemType('journal');
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No journals found. Create one to get started!</Typography>
        )}
      </TabPanel>

      <CreateLogDialog
        open={isCreateLogOpen}
        onClose={() => {
          setIsCreateLogOpen(false);
          setSelectedLog(null);
        }}
        initialData={selectedLog}
      />

      {/* Create Mindmap Dialog */}
      <Dialog open={isCreateMindmapOpen} onClose={() => setIsCreateMindmapOpen(false)}>
        <DialogTitle>Create New Mindmap</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newMindmap.title}
            onChange={(e) => setNewMindmap({ ...newMindmap, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Central Topic"
            fullWidth
            multiline
            rows={4}
            value={newMindmap.text}
            onChange={(e) => setNewMindmap({ ...newMindmap, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateMindmapOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateMindmap} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Create Note Dialog */}
      <Dialog open={isCreateNoteOpen} onClose={() => {
        setIsCreateNoteOpen(false);
        clearInputs();
      }}>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProjectId || ''}
              label="Project"
              onChange={handleProjectChange}
              required
            >
              {projects.map((project: any) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsCreateNoteOpen(false);
            clearInputs();
          }}>Cancel</Button>
          <Button onClick={handleCreateNote} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Create Idea Dialog */}
      <Dialog open={isCreateIdeaOpen} onClose={() => setIsCreateIdeaOpen(false)}>
        <DialogTitle>Create New Idea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newIdea.status}
              label="Status"
              onChange={(e) => setNewIdea({ ...newIdea, status: e.target.value as 'draft' | 'in_progress' | 'implemented' | 'archived' })}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="implemented">Implemented</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateIdeaOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateIdea} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Mindmap Dialog */}
      <Dialog open={isEditMindmapOpen} onClose={() => {
        setIsEditMindmapOpen(false);
        setSelectedMindmap(null);
        clearInputs();
      }}>
        <DialogTitle>Edit Mindmap</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newMindmap.title}
            onChange={(e) => setNewMindmap({ ...newMindmap, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Central Topic"
            fullWidth
            multiline
            rows={4}
            value={newMindmap.text}
            onChange={(e) => setNewMindmap({ ...newMindmap, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsEditMindmapOpen(false);
            setSelectedMindmap(null);
            clearInputs();
          }}>Cancel</Button>
          <Button onClick={handleUpdateMindmap} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditNoteOpen} onClose={() => {
        setIsEditNoteOpen(false);
        setSelectedNote(null);
        clearInputs();
      }}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProjectId || ''}
              label="Project"
              onChange={handleProjectChange}
              required
            >
              {projects.map((project: any) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsEditNoteOpen(false);
            setSelectedNote(null);
            clearInputs();
          }}>Cancel</Button>
          <Button onClick={handleUpdateNote} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Idea Dialog */}
      <Dialog open={isEditIdeaOpen} onClose={() => {
        setIsEditIdeaOpen(false);
        setSelectedIdea(null);
        clearInputs();
      }}>
        <DialogTitle>Edit Idea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newIdea.status}
              label="Status"
              onChange={(e) => setNewIdea({ ...newIdea, status: e.target.value as 'draft' | 'in_progress' | 'implemented' | 'archived' })}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="implemented">Implemented</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsEditIdeaOpen(false);
            setSelectedIdea(null);
            clearInputs();
          }}>Cancel</Button>
          <Button onClick={handleUpdateIdea} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete {deleteItemType.charAt(0).toUpperCase() + deleteItemType.slice(1)}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {deleteItemType}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
