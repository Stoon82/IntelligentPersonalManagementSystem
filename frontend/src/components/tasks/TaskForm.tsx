import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
    SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Task, TaskCreate, TaskUpdate } from '../../types/task';
import { Project } from '../../types/project';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../../services/projects';

const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    status: yup.string().required('Status is required'),
    priority: yup.string().required('Priority is required'),
    due_date: yup.string().nullable(),
    project_id: yup.number().nullable(),
});

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: TaskCreate) => void;
    isSubmitting?: boolean;
    initialData?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    open,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
}) => {
    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => getProjects(),
        initialData: [] as Project[]
    });

    const formik = useFormik<TaskCreate>({
        initialValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            status: initialData?.status || 'todo',
            priority: initialData?.priority || 'medium',
            due_date: initialData?.due_date || undefined,
            project_id: initialData?.project_id || undefined,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleSelectChange = (field: string) => (event: SelectChangeEvent<string | number>) => {
        const value = event.target.value === '' ? undefined : event.target.value;
        formik.setFieldValue(field, value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit Task' : 'New Task'}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />

                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Project</InputLabel>
                            <Select
                                id="project_id"
                                name="project_id"
                                value={formik.values.project_id?.toString() ?? ''}
                                onChange={handleSelectChange('project_id')}
                                label="Project"
                                error={formik.touched.project_id && Boolean(formik.errors.project_id)}
                            >
                                <MenuItem value="">No Project</MenuItem>
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                id="status"
                                name="status"
                                value={formik.values.status || 'todo'}
                                onChange={handleSelectChange('status')}
                                label="Status"
                                error={formik.touched.status && Boolean(formik.errors.status)}
                            >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                id="priority"
                                name="priority"
                                value={formik.values.priority || 'medium'}
                                onChange={handleSelectChange('priority')}
                                label="Priority"
                                error={formik.touched.priority && Boolean(formik.errors.priority)}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>

                        <DateTimePicker
                            label="Due Date"
                            value={formik.values.due_date ? new Date(formik.values.due_date) : null}
                            onChange={(date) => {
                                formik.setFieldValue('due_date', date ? date.toISOString() : undefined);
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: formik.touched.due_date && Boolean(formik.errors.due_date),
                                    helperText: formik.touched.due_date && formik.errors.due_date as string
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
