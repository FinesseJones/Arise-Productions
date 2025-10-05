import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY!;

if (!SECRET_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Example usage:
// const encryptedScript = encrypt(scriptContent);
// await db.save({ script: encryptedScript });
