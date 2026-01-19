import {
  sanitizeInput,
  isValidEmail,
  isSafeUrl,
  RateLimiter,
  generateSecureToken,
  maskSensitiveData,
  checkPasswordStrength,
} from '@/lib/utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello bWorld/b');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isSafeUrl', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3001' },
        writable: true,
      });
    });

    it('should allow relative paths', () => {
      expect(isSafeUrl('/products')).toBe(true);
      expect(isSafeUrl('/admin/dashboard')).toBe(true);
    });

    it('should reject protocol-relative URLs', () => {
      expect(isSafeUrl('//evil.com')).toBe(false);
    });

    it('should reject external URLs', () => {
      expect(isSafeUrl('https://evil.com')).toBe(false);
    });
  });

  describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new RateLimiter(3, 1000);
      expect(limiter.isAllowed('test')).toBe(true);
      expect(limiter.isAllowed('test')).toBe(true);
      expect(limiter.isAllowed('test')).toBe(true);
    });

    it('should block requests over limit', () => {
      const limiter = new RateLimiter(2, 1000);
      expect(limiter.isAllowed('test')).toBe(true);
      expect(limiter.isAllowed('test')).toBe(true);
      expect(limiter.isAllowed('test')).toBe(false);
    });

    it('should reset after calling reset', () => {
      const limiter = new RateLimiter(1, 1000);
      limiter.isAllowed('test');
      limiter.reset('test');
      expect(limiter.isAllowed('test')).toBe(true);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token of correct length', () => {
      const token = generateSecureToken(32);
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it('should generate different tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask data correctly', () => {
      expect(maskSensitiveData('1234567890', 4)).toBe('1234******');
      expect(maskSensitiveData('secret', 2)).toBe('se****');
    });

    it('should handle short data', () => {
      expect(maskSensitiveData('ab', 4)).toBe('***');
    });
  });

  describe('checkPasswordStrength', () => {
    it('should score strong password highly', () => {
      const result = checkPasswordStrength('MyP@ssw0rd123!');
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should provide feedback for weak password', () => {
      const result = checkPasswordStrength('weak');
      expect(result.score).toBeLessThan(3);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should check for length', () => {
      const result = checkPasswordStrength('short');
      expect(result.feedback).toContain('Password should be at least 8 characters');
    });

    it('should check for mixed case', () => {
      const result = checkPasswordStrength('lowercase123!');
      expect(result.feedback).toContain('Use both uppercase and lowercase letters');
    });
  });
});
