# Contributing to IPMS

## Development Rules and Guidelines

### 1. Code Organization

#### Frontend Structure
- Components should be in `frontend/src/components/`
- Pages should be in `frontend/src/pages/`
- API services should be in `frontend/src/services/`
- Types should be in `frontend/src/types/`
- Context providers should be in `frontend/src/contexts/`
- Utilities should be in `frontend/src/utils/`

#### Backend Structure
- Routes should be in `backend/routers/`
- Database models should be in `backend/models/`
- Schemas should be in `backend/schemas/`
- Utilities should be in `backend/utils/`
- Configuration should be in `backend/config/`

### 2. Coding Standards

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks in React
- Prefer const over let, avoid var
- Use async/await over .then()
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components focused and small
- Use proper type annotations

```typescript
// ❌ Bad
var x = 1;
function doStuff(y) {
  return y + x;
}

// ✅ Good
interface CalculationParams {
  value: number;
  multiplier: number;
}

const calculateTotal = ({ value, multiplier }: CalculationParams): number => {
  return value * multiplier;
};
```

#### Python
- Follow PEP 8 style guide
- Use type hints for function parameters and returns
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions focused and small
- Use proper dependency injection

```python
# ❌ Bad
def process(x):
    return x + 1

# ✅ Good
from typing import List
from models.user import User

def get_active_users(users: List[User]) -> List[User]:
    """
    Filter and return only active users from the given list.
    
    Args:
        users: List of User objects to filter
        
    Returns:
        List of active User objects
    """
    return [user for user in users if user.is_active]
```

### 3. Git Workflow

#### Branch Naming
- feature/[feature-name] for new features
- fix/[bug-name] for bug fixes
- refactor/[refactor-name] for code refactoring
- docs/[doc-name] for documentation changes

#### Commit Messages
Follow the Conventional Commits specification:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks

```bash
# ❌ Bad
git commit -m "fixed stuff"

# ✅ Good
git commit -m "fix: resolve authentication token refresh loop"
```

### 4. Testing

#### Frontend Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Use React Testing Library for component tests
- Maintain test coverage above 80%

#### Backend Testing
- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Use pytest for testing
- Maintain test coverage above 80%

### 5. Documentation

#### Code Documentation
- Add JSDoc comments for TypeScript functions
- Add docstrings for Python functions
- Keep README files up to date
- Document complex algorithms
- Include examples for non-obvious code

#### API Documentation
- Document all API endpoints in docs/api/
- Include request/response examples
- Document error responses
- Keep OpenAPI/Swagger docs updated

### 6. Error Handling

#### Frontend
- Use proper error boundaries
- Handle API errors gracefully
- Show user-friendly error messages
- Log errors appropriately

#### Backend
- Use proper exception handling
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Log errors with proper context

### 7. Performance

#### Frontend
- Use React.memo for expensive renders
- Implement proper pagination
- Optimize images and assets
- Use code splitting where appropriate

#### Backend
- Implement proper database indexing
- Use caching where appropriate
- Optimize database queries
- Implement rate limiting

### 8. Security

- Never commit sensitive data (API keys, credentials)
- Use environment variables for configuration
- Implement proper input validation
- Follow security best practices
- Keep dependencies updated

### 9. Review Process

#### Pull Request Guidelines
- Create detailed PR descriptions
- Include screenshots for UI changes
- Link related issues
- Keep PRs focused and small
- Ensure all tests pass
- Address all review comments

#### Code Review Checklist
- Check code style compliance
- Verify test coverage
- Review security implications
- Check performance impact
- Verify documentation updates

### 10. Deployment

- Follow the deployment checklist
- Test in staging environment first
- Perform database backups before deployment
- Monitor application after deployment
- Document deployment steps

### 11. Bug Reporting

We have an integrated bug reporting system that makes it easy to report issues:

#### Using the Bug Reporter
1. Click the floating "Report Bug" button in the bottom-right corner of any page
2. Fill in the bug report form:
   - Title: A clear, concise description of the issue
   - Description: Detailed information about what happened
3. The system automatically collects:
   - System information (browser, screen resolution, etc.)
   - Current error logs (if any errors occurred)
4. Click "Submit" to send the report

#### Where to Find Bug Reports
- All bug reports are stored in `BUG_REPORTS/BUG_REPORTS.md`
- Each report includes:
  - Title and timestamp
  - Description of the issue
  - System information
  - Error logs (if any)

#### When to Use the Bug Reporter
- Unexpected errors or crashes
- UI/UX issues
- Performance problems
- Any behavior that seems incorrect

Remember to check the existing bug reports before submitting a new one to avoid duplicates.

## Getting Help

If you need help or have questions:
1. Check existing documentation
2. Search closed issues
3. Ask in the team chat
4. Create a new issue

Remember: These guidelines are meant to help maintain code quality and consistency. If you have suggestions for improving these guidelines, please create an issue or PR.
