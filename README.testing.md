# Testing Guide

## Setup

Testing framework has been configured with Jest and React Testing Library.

### Installation

```bash
npm install
```

This will install all testing dependencies including:
- `jest` - Testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in the `__tests__` directory, mirroring the project structure:

```
__tests__/
├── components/
│   └── ui/
│       └── button.test.tsx
├── lib/
│   ├── stores/
│   │   ├── authStore.test.ts
│   │   └── cartStore.test.ts
│   └── utils/
│       └── security.test.ts
```

## Example Tests

### Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Store Test
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/lib/stores/authStore';

describe('AuthStore', () => {
  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.login(mockUser, mockToken);
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Utility Test
```typescript
import { sanitizeInput } from '@/lib/utils/security';

describe('sanitizeInput', () => {
  it('should remove HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('scriptalert("xss")/script');
  });
});
```

## Coverage Goals

- **Target:** 60% overall coverage
- **Critical paths:** 80%+ coverage
- **Utilities:** 90%+ coverage

## Writing Tests

### Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Arrange, Act, Assert pattern**
4. **Mock external dependencies**
5. **Test edge cases**

### What to Test

✅ **DO test:**
- User interactions
- State changes
- API calls (mocked)
- Error handling
- Edge cases
- Utility functions

❌ **DON'T test:**
- Third-party libraries
- Implementation details
- Trivial code

## Mocking

### API Calls
```typescript
jest.mock('@/lib/api/client');
```

### Next.js Router
Already mocked in `jest.setup.ts`

### Environment Variables
Already configured in `jest.setup.ts`

## Troubleshooting

### Tests not running
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type errors
Ensure `@types/jest` is installed and `jest.setup.ts` is properly configured.

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

## Next Steps

1. Write tests for critical user flows
2. Add integration tests
3. Set up E2E testing with Playwright
4. Configure pre-commit hooks to run tests
