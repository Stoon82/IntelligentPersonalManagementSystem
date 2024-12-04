import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    OpenInNew as OpenInNewIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getProjects } from '../../services/projects';
import { Project, ProjectStatus } from '../../types/project';

export const RecentProjects: React.FC = () => {
    const navigate = useNavigate();
    const { data: recentProjects = [], isLoading, error } = useQuery<Project[]>({
        queryKey: ['projects', { recent: true }],
        queryFn: () => getProjects({ sort_by: 'updated_at' }),
    });

    const getStatusColor = (status: ProjectStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
        switch (status) {
            case 'planning':
                return 'default';
            case 'active':
                return 'primary';
            case 'on_hold':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error loading recent projects
            </Alert>
        );
    }

    if (recentProjects.length === 0) {
        return (
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="body1" align="center" color="textSecondary">
                    No recent projects
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ mt: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2">
                    Recent Projects
                </Typography>
            </Box>
            <List>
                {recentProjects.map((project) => (
                    <ListItem 
                        key={project.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: 1,
                            py: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="subtitle1" component="div">
                                {project.title}
                            </Typography>
                            <Box>
                                <IconButton
                                    edge="end"
                                    aria-label="view project"
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    <OpenInNewIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="edit project"
                                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="textSecondary" component="span">
                                Last updated: {format(new Date(project.updated_at), 'MMM d, yyyy')}
                            </Typography>
                            <Chip
                                label={project.status}
                                size="small"
                                color={getStatusColor(project.status)}
                            />
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
