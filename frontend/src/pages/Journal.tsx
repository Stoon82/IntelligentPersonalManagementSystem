import React, { useState, ChangeEvent, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Typography, 
  SelectChangeEvent,
  Container,
  Box,
  Paper
} from '@mui/material';

const Journal: React.FC = () => {
  console.log('[Journal] Component rendering');
  
  // Initialize state with empty strings to ensure controlled inputs
  const [entry, setEntry] = useState<string>('');
  const [mood, setMood] = useState<string | null>(null);
  const [prompt] = useState<string>('What are you grateful for today?');

  useEffect(() => {
    console.log('[Journal] Current state:', {
      entry: entry === '' ? '(empty string)' : entry,
      mood: mood === '' ? '(empty string)' : mood,
      prompt
    });
  }, [entry, mood, prompt]);

  const handleEntryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log('[Journal] Entry changing:', {
      oldValue: entry === '' ? '(empty string)' : entry,
      newValue: event.target.value === '' ? '(empty string)' : event.target.value,
      type: typeof event.target.value
    });
    setEntry(event.target.value ?? '');
  };

  const handleMoodChange = (event: SelectChangeEvent<string>) => {
    console.log('[Journal] Mood changing:', {
      oldValue: mood === '' ? '(empty string)' : mood,
      newValue: event.target.value === '' ? '(empty string)' : event.target.value,
      type: typeof event.target.value
    });
    const newValue = event.target.value;
    // Only update if we have a valid value or empty string
    if (typeof newValue === 'string') {
      setMood(newValue);
    }
  };

  const handleSubmit = () => {
    if (!mood) {
      console.log('[Journal] Submit blocked: mood not selected');
      return; // Don't submit if mood is not selected
    }
    console.log('[Journal] Submitting:', { entry, mood, prompt });
    console.log('Journal Entry:', entry);
    console.log('Mood:', mood);
    console.log('Prompt:', prompt);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Journal Entry
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Reflection Prompt
            </Typography>
            <Typography variant="body1" gutterBottom>
              {prompt}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              How are you feeling?
            </Typography>
            <Select
              value={mood ?? ''}
              onChange={handleMoodChange}
              displayEmpty
              fullWidth
              variant="outlined"
              sx={{ minHeight: 48 }}
              renderValue={(selected) => {
                console.log('[Journal] Select renderValue:', {
                  selected: selected === '' ? '(empty string)' : selected,
                  type: typeof selected
                });
                return selected || 'Select your mood';
              }}
            >
              <MenuItem value="">
                <em>Select your mood</em>
              </MenuItem>
              <MenuItem value="happy">Happy 😊</MenuItem>
              <MenuItem value="sad">Sad 😢</MenuItem>
              <MenuItem value="neutral">Neutral 😐</MenuItem>
              <MenuItem value="anxious">Anxious 😰</MenuItem>
              <MenuItem value="excited">Excited 🎉</MenuItem>
              <MenuItem value="tired">Tired 😴</MenuItem>
              <MenuItem value="motivated">Motivated 💪</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Write your thoughts
            </Typography>
            <TextField
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={entry || ''}
              onChange={handleEntryChange}
              placeholder="Start writing here..."
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!mood || !entry.trim()}
            >
              Save Entry
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Journal;
