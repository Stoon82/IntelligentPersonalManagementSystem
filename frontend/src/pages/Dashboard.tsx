import React, { useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Alert, Card, CardHeader, CardContent, Button } from '@mui/material';
import {
    Assignment as TaskIcon,
    CheckCircle as CompletedIcon,
    Warning as OverdueIcon,
    Schedule as UpcomingIcon,
    TrendingUp as TrendingIcon,
    Add as AddIcon,
    Book as JournalIcon,
} from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useTaskStats } from '../hooks/useTaskStats';
import { useLogs } from '../hooks/useLogs';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskDistributionChart } from '../components/dashboard/TaskDistributionChart';
import { UserProfileCard } from '../components/dashboard/UserProfileCard';
import { ActionButtons } from '../components/dashboard/ActionButtons';
import { RecentProjects } from '../components/dashboard/RecentProjects';
import LogAssistant from '../components/logs/LogAssistant';
import { LogForm } from '../components/LogForm';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { tasks, isLoading: isLoadingTasks, error: tasksError } = useTasks();
    const { createLog, isCreating } = useLogs();
    const stats = useTaskStats(tasks || []);
    const [isLogFormOpen, setIsLogFormOpen] = useState(false);
    const navigate = useNavigate();

    const handleCreateLog = async (logData: any) => {
        await createLog(logData);
        setIsLogFormOpen(false);
    };

    if (isLoadingTasks) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (tasksError) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error loading dashboard data. Please try again later.
            </Alert>
        );
    }

    const statusData = [
        { name: 'To Do', value: stats.tasksByStatus.todo, color: '#1976d2' },
        { name: 'In Progress', value: stats.tasksByStatus.in_progress, color: '#ff9800' },
        { name: 'Done', value: stats.tasksByStatus.done, color: '#4caf50' },
    ];

    const priorityData = [
        { name: 'High', value: stats.tasksByPriority.high, color: '#f44336' },
        { name: 'Medium', value: stats.tasksByPriority.medium, color: '#ff9800' },
        { name: 'Low', value: stats.tasksByPriority.low, color: '#2196f3' },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Total Tasks"
                                value={stats.totalTasks}
                                icon={<TaskIcon />}
                                color="#1976d2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Completed"
                                value={stats.completedTasks}
                                icon={<CompletedIcon />}
                                color="#4caf50"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Overdue"
                                value={stats.overdueTasks}
                                icon={<OverdueIcon />}
                                color="#f44336"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Upcoming"
                                value={stats.upcomingTasks}
                                icon={<UpcomingIcon />}
                                color="#ff9800"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardHeader 
                                    title={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <JournalIcon />
                                            <Typography variant="h6">Journal</Typography>
                                        </Box>
                                    }
                                    action={
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<AddIcon />}
                                            onClick={() => navigate('/journal')}
                                        >
                                            New Entry
                                        </Button>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body1" color="textSecondary" paragraph>
                                        Record your thoughts, track your mood, and reflect on your journey.
                                    </Typography>
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate('/journal')}
                                        >
                                            View Journal
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TaskDistributionChart
                                title="Tasks by Status"
                                data={statusData}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TaskDistributionChart
                                title="Tasks by Priority"
                                data={priorityData}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <RecentProjects />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <UserProfileCard />
                        </Grid>
                        <Grid item xs={12}>
                            <ActionButtons />
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title="Quick Log Assistant"
                                    action={
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => setIsLogFormOpen(true)}
                                        >
                                            New Log
                                        </Button>
                                    }
                                />
                                <CardContent>
                                    <LogAssistant />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LogForm
                open={isLogFormOpen}
                onClose={() => setIsLogFormOpen(false)}
                onSubmit={handleCreateLog}
                isSubmitting={isCreating}
            />
        </Box>
    );
};
