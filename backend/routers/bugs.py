from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime
import json

router = APIRouter()

# Get the project root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BUG_REPORTS_PATH = os.path.join(PROJECT_ROOT, "BUG_REPORTS", "BUG_REPORTS.md")

class BugReport(BaseModel):
    title: str
    description: str
    systemInfo: str
    errorLogs: Optional[List[str]] = None

def append_to_bug_reports(bug_report: BugReport):
    """Append a new bug report to the BUG_REPORTS.md file."""
    error_logs = "No error logs provided"
    if bug_report.errorLogs:
        error_logs = "\n".join(bug_report.errorLogs)
        
    bug_report_md = f"""
## {bug_report.title}
**Reported at:** {datetime.now().isoformat()}

### Description
{bug_report.description}

### System Information
```json
{bug_report.systemInfo}
```

### Error Logs
```
{error_logs}
```

---
"""
    
    # Create the directory and file if it doesn't exist
    if not os.path.exists(os.path.dirname(BUG_REPORTS_PATH)):
        os.makedirs(os.path.dirname(BUG_REPORTS_PATH))
    if not os.path.exists(BUG_REPORTS_PATH):
        with open(BUG_REPORTS_PATH, "w", encoding="utf-8") as f:
            f.write("# Bug Reports\n")
    
    # Append the new bug report
    with open(BUG_REPORTS_PATH, "a", encoding="utf-8") as f:
        f.write(bug_report_md)

@router.post("/report")
async def report_bug(bug_report: BugReport):
    try:
        append_to_bug_reports(bug_report)
        return {"message": "Bug report successfully submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
