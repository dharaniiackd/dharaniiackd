// Type definitions for strength result
export interface StrengthResult {
  label: string;
  color: 'red' | 'orange' | 'green' | 'gray';
  score: number; // 0 to 4
  feedback: string[];
  isStrong: boolean;
}

/**
 * analyzes the password strength based on specific criteria:
 * - Length >= 8
 * - Contains uppercase
 * - Contains lowercase
 * - Contains number
 * - Contains special char
 */
export const checkPasswordStrength = (password: string): StrengthResult => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      label: 'Empty',
      color: 'gray',
      score: 0,
      feedback: [],
      isStrong: false,
    };
  }

  // Criteria checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$%&!^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasLength) feedback.push("Use at least 8 characters");
  if (!hasUpper) feedback.push("Add an uppercase letter");
  if (!hasLower) feedback.push("Add a lowercase letter");
  if (!hasNumber) feedback.push("Add a number");
  if (!hasSpecial) feedback.push("Add a special character (@#$%&!)");

  // Scoring Logic based on the prompt's requirements
  // "Weak" if < 8 chars, or missing upper/lower
  if (!hasLength || !hasUpper || !hasLower) {
    return {
      label: 'Weak',
      color: 'red',
      score: 1, // Visual score
      feedback,
      isStrong: false,
    };
  }

  // "Medium" if missing number or special char
  if (!hasNumber || !hasSpecial) {
    return {
      label: 'Medium',
      color: 'orange',
      score: 2, // Visual score
      feedback,
      isStrong: false,
    };
  }

  // "Strong" if all pass
  return {
    label: 'Strong',
    color: 'green',
    score: 3, // Visual score
    feedback: ["Password is secure"],
    isStrong: true,
  };
};

/**
 * Generates a SHA-256 hash of the password using the Web Crypto API.
 */
export const generateSHA256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};