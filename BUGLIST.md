# Bug List

This document tracks known issues and bugs in the IPMS system. Each bug is categorized by severity and status.

## Active Bugs

### High Priority
- None currently reported

### Medium Priority
1. **Project Filter Reset** (ID: PFR-001)
   - Description: Project filter occasionally resets when navigating between pages
   - Status: Under Investigation
   - Assigned: TBD
   - Reported: 2024-01-24

2. **Log Entry Timestamp** (ID: LET-001)
   - Description: Log entry timestamps sometimes display in local time instead of UTC
   - Status: Confirmed
   - Assigned: TBD
   - Reported: 2024-01-24

### Low Priority
1. **UI Alignment** (ID: UIA-001)
   - Description: Minor alignment issues in the dashboard on mobile devices
   - Status: Confirmed
   - Assigned: TBD
   - Reported: 2024-01-24

## Resolved Bugs

### Recently Fixed
1. **User Session** (ID: USE-001)
   - Description: User session sometimes persisted after logout
   - Resolution: Updated token handling and cleanup
   - Fixed: 2024-01-24

2. **Database Cascade** (ID: DBC-001)
   - Description: Deleting projects didn't properly cascade to related logs
   - Resolution: Added proper cascade rules in SQLAlchemy models
   - Fixed: 2024-01-24

## Reporting New Bugs

When reporting new bugs, please include:
1. Clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Browser/environment information

Submit bug reports through the issue tracking system or contact the development team directly.
