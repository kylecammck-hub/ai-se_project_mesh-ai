// Simple, dependency-free field validation shared by the auth forms.
// Keeps the check in one place so Login and Register stay consistent.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function getEmailError(email: string): string {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address';
  }
  return '';
}

export function getPasswordError(password: string, minLength = 8): string {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return '';
}

export function getNameError(name: string): string {
  if (!name.trim()) {
    return 'Name is required';
  }
  return '';
}
