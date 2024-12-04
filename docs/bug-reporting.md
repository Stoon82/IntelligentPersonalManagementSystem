# Bug Reporting System

## Overview
The IPMS project includes an integrated bug reporting system that allows users to submit bug reports. The system automatically stores reports in a markdown file for easy tracking and review.

## Features
- Simple API endpoint for submitting bug reports
- Automatic timestamp generation
- Markdown-based storage format
- Optional error log collection

## API Usage

### Frontend
```typescript
interface BugReport {
  title: string;
  description: string;
  systemInfo: string;
  errorLogs?: string[];
}

// Submit a bug report
await reportBug({
  title: "Issue title",
  description: "Description of the issue",
  systemInfo: JSON.stringify({
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    screenResolution: `${window.screen.width}x${window.screen.height}`
  }),
  errorLogs: [] // Optional
});
```

### Backend
The API endpoint `/api/bugs/report` accepts POST requests with the following structure:
```json
{
  "title": "string",
  "description": "string",
  "systemInfo": "string",
  "errorLogs": ["string"] // Optional
}
```

## Storage Format
Bug reports are stored in `BUG_REPORTS/BUG_REPORTS.md` with the following structure:

```markdown
## [Bug Title]
**Reported at:** [Timestamp]

### Description
[User's description]

### System Information
```json
[System information as JSON string]
```

### Error Logs
```
[Error logs if provided, otherwise "No error logs provided"]
```

---
## Implementation Details
- Frontend: Uses `apiClient` from services/api.ts for making requests
- Backend: FastAPI endpoint in routers/bugs.py
- Storage: Markdown file with automatic directory creation if needed
- Error Handling: Optional error logs with fallback message

## Best Practices
1. Include clear, descriptive titles
2. Provide detailed descriptions
3. Ensure system information is properly formatted as JSON
4. Include error logs when available
